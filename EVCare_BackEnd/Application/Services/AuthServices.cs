using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Dtos.Login;
using Application.Infrastructures;
using Application.Interfaces;
using Application.Parttern;
using Azure;
using DataAccess.Dtos.Others;
using DataAccess.Dtos.Register;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Application.Services
{
    public class AuthServices : IAuthServices
    {
        private readonly IAccountRepository _accountRepository;
        private readonly ITokenServices _tokenServices;
        private readonly IConfiguration _configuration;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IOtpServices _otpServices;

        public AuthServices(IAccountRepository accountRepository, ITokenServices tokenServices
            , IConfiguration configuration, IRefreshTokenRepository refreshTokenRepository,
            ICustomerRepository customerRepository, IOtpServices otpServices)
        {
            this._accountRepository = accountRepository;
            this._tokenServices = tokenServices;
            this._configuration = configuration;
            this._refreshTokenRepository = refreshTokenRepository;
            this._customerRepository = customerRepository;
            this._otpServices = otpServices;
        }
        public async Task<ResponseDto<RegisterResponseDto>> RegisterAsync(RegisterRequestDto data)
        {
            var checkEmailExist = await _accountRepository.GetAccountByEmail(data.email);
            var checkPhoneExist = await _accountRepository.GetAccountByPhoneAsync(data.phone);
            if (checkEmailExist != null || checkPhoneExist != null)
            {
                throw new Exception(Message.ACCOUNT_EXISTS);
            }
            if (!Regex.IsMatch(data.email, RegexPartterns.EMAIL_PATTERN))
            {
                throw new Exception(Message.INVALID_EMAIL);
            }
            if (!Regex.IsMatch(data.phone, RegexPartterns.PHONE_NUMBER_PATTERN))
            {
                if (!data.phone.Equals("default phone number"))
                {
                    throw new Exception(Message.INVALID_PHONE);
                }
            }
            if (!Regex.IsMatch(data.password, RegexPartterns.PASSWORD_PATTERN))
            {
                throw new Exception(Message.WEAK_PASSWORD);
            }
            if (!data.password.Equals(data.confirmPassword))
            {
                throw new Exception(Message.PASSWORD_MISMATCH);
            }

            await _otpServices.SaveOtpAsync(data);
            return new ResponseDto<RegisterResponseDto>
            {
                statusCode = 201,
                message = Message.OTP_HAS_BEEN_SENT,
                data = null
            };
        }
        public async Task<ResponseDto<RegisterResponseDto>> VerifyRegisterAsync(string email, string otp)
        {
            var data = await _otpServices.GetObjectData<RegisterRequestDto>(email);
            if (data is null)
                throw new Exception(Message.OTP_INVALID);
            var hashPassword = BCrypt.Net.BCrypt.HashPassword(data.password);
            var newAccount = new Account
            {
                Email = data.email,
                Phone = data.phone,
                Hash_Password = hashPassword,
                Create_At = DateTime.UtcNow,
                Updated_At = DateTime.UtcNow,
                Deleted_At = DateTime.MinValue,
                Role = RoleEnum.Customer,
                First_Name = data.firstName.Trim(),
                Last_Name = data.lastName.Trim(),
            };
            await _accountRepository.AddAsync(newAccount);
            var newCustomer = new Customer
            {
                AccountId = newAccount.Id,
                Rank = CustomerRankEnum.Regular,
            };
            await _customerRepository.AddAsync(newCustomer);
            return new ResponseDto<RegisterResponseDto>
            {
                statusCode = 200,
                message = Message.REGISTER_SUCCESS,
                data = new RegisterResponseDto
                {
                    email = newAccount.Email,
                    phone = newAccount.Phone,
                }
            };
        }
        public async Task<ResponseDto<LoginResponseDto>> LoginAsync(LoginRequestDto data, HttpContext context)
        {
            var account = await _accountRepository.GetAccountByEmail(data.email);
            if (account is null)
            {
                throw new Exception(Message.ACCOUNT_NOT_FOUND);
            }

            if (!BCrypt.Net.BCrypt.Verify(data.password, account.Hash_Password))
            {
                throw new Exception(Message.LOGIN_FAILED);
            }

            return await GenerateTokenAsync(account, new ResponseDto<LoginResponseDto>(), context);
        }
        public async Task<ResponseDto<LoginResponseDto>> LoginGoogleAsync(string idToken, HttpContext context)
        {
            var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(idToken);
            if (payload is null || string.IsNullOrEmpty(payload.Email))
            {
                throw new Exception(Message.LOGIN_FAILED);
            }

            var email = payload.Email;
            var first_name = payload.GivenName;
            var last_name = payload.FamilyName;

            var account = await _accountRepository.GetAccountByEmail(email);
            if (account is null)
            {
                var defaultPassword = _configuration["DefaultPassword:Google"] ?? "12345678@sa";
                var RegisterData = new RegisterRequestDto
                {
                    email = email,
                    phone = "default phone number",
                    password = defaultPassword,
                    confirmPassword = defaultPassword,
                };
                await RegisterAsync(RegisterData);
                account = await _accountRepository.GetAccountByEmail(email);
            }
            return await GenerateTokenAsync(account, new ResponseDto<LoginResponseDto>(), context);
        }
        public async Task<ResponseDto<LoginResponseDto>> GenerateTokenAsync(Account account, ResponseDto<LoginResponseDto> response, HttpContext context)
        {
            await _refreshTokenRepository.RevokeAllAsyncByAccountId(account.Id);

            var accessToken = _tokenServices.GenerateAccessToken(account);
            var refreshToken = _tokenServices.GenerateRefreshToken();
            var refreshHash = _tokenServices.HashToken(refreshToken);
            var expires = _tokenServices.GetExpireDays();

            var newRefreshToken = new RefreshToken
            {
                AccountId = account.Id,
                Token = refreshHash,
                ExpiryDate = expires,
                IsRevoked = false
            };
            await _refreshTokenRepository.AddAsync(newRefreshToken);
            var rtName = _configuration["Cookies:RefreshTokenName"];
            SetRefreshCookie(context, refreshToken, expires);

            response.statusCode = 200;
            response.message = Message.LOGIN_SUCCESS;
            response.data = new LoginResponseDto
            {
                accessToken = accessToken,
                refreshToken = refreshToken,
            };

            return response;
        }
        public async Task LogoutAsync(HttpContext context)
        {
            var cookieName = _configuration["Cookies:RefreshTokenName"];
            var token = context.Request.Cookies[cookieName];
            if (token is not null && token.Length != 0)
            {
                var hash = _tokenServices.HashToken(token);
                await _refreshTokenRepository.RevokeByHashAsync(hash);
            }
            context.Response.Cookies.Delete(cookieName, new CookieOptions
            {
                SameSite = SameSiteMode.None,
                Secure = true
            });
        }
        public async Task<ResponseDto<LoginResponseDto>> RefreshAsync(HttpContext context)
        {
            var response = new ResponseDto<LoginResponseDto>();
            response.statusCode = 200;
            response.message = Message.REFRESH_TOKEN_SUCCESS;
            response.data = null;

            var cookieName = _configuration["Cookies:RefreshTokenName"];
            var token = context.Request.Cookies[cookieName];
            if (token is null)
            {
                throw new Exception("No refresh token provided.");
            }

            var hash = _tokenServices.HashToken(token);
            var refreshToken = await _refreshTokenRepository.GetValidAsync(hash);
            if (refreshToken is null)
            {
                throw new Exception(Message.UNAUTHORIZED);
            }

            var account = await _accountRepository.GetByIdAsync(refreshToken.AccountId);
            if (account is null)
            {
                throw new Exception(Message.ACCOUNT_NOT_FOUND);
            }

            refreshToken.IsRevoked = true;
            var newRefresh = _tokenServices.GenerateRefreshToken();
            var newRefreshHash = _tokenServices.HashToken(newRefresh);
            var newAccessToken = _tokenServices.GenerateAccessToken(account);
            var expires = _tokenServices.GetExpireDays();

            var newRefreshToken = new RefreshToken
            {
                Token = newRefreshHash,
                AccountId = account.Id,
                IsRevoked = false,
                ExpiryDate = expires
            };
            await _refreshTokenRepository.RotateAsync(refreshToken, newRefreshToken);
            SetRefreshCookie(context, newRefresh, expires);
            response.data = new LoginResponseDto
            {
                accessToken = newAccessToken,
                refreshToken = newRefresh
            };
            return response;
        }
        public void SetRefreshCookie(HttpContext context, string refresh, DateTime expires)
        {
            var cookieName = _configuration["Cookies:RefreshTokenName"];
            context.Response.Cookies.Append(cookieName, refresh, new CookieOptions
            {
                HttpOnly = true,
                Expires = expires,
                Secure = true,
                SameSite = SameSiteMode.None,
            });
        }
        public async Task ResetPassword(ResetPasswordRequestDto data)
        {
            var account = await _accountRepository.GetAccountByEmail(data.email);
            if (account is null)
            {
                throw new Exception(Message.ACCOUNT_NOT_FOUND);
            }
            if (!Regex.IsMatch(data.newPassword, RegexPartterns.PASSWORD_PATTERN))
            {
                throw new Exception(Message.WEAK_PASSWORD);
            }
            account.Hash_Password = BCrypt.Net.BCrypt.HashPassword(data.newPassword);
            account.Updated_At = DateTime.UtcNow;
            await _accountRepository.UpdateAsync(account);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
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
using CloudinaryDotNet;
using CloudinaryDotNet.Core;
using DataAccess.Dtos.Accounts;
using DataAccess.Dtos.Customers;
using DataAccess.Dtos.Employees;
using DataAccess.Dtos.Others;
using DataAccess.Dtos.Register;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ITechnicianRepository _technicianRepository;
        private readonly IGoogleValidator _googleValidator;

        public AuthServices(IAccountRepository accountRepository, ITokenServices tokenServices
            , IConfiguration configuration, IRefreshTokenRepository refreshTokenRepository,
            ICustomerRepository customerRepository, IOtpServices otpServices,
            IEmployeeRepository employeeRepository, ITechnicianRepository technicianRepository
            ,IGoogleValidator googleValidator)
        {
            this._accountRepository = accountRepository;
            this._tokenServices = tokenServices;
            this._configuration = configuration;
            this._refreshTokenRepository = refreshTokenRepository;
            this._customerRepository = customerRepository;
            this._otpServices = otpServices;
            this._employeeRepository = employeeRepository;
            this._technicianRepository = technicianRepository;
            _googleValidator = googleValidator;
        }
        public async Task<ResponseDto<RegisterResponseDto>> RegisterAsync(RegisterRequestDto data)
        {
            try
            {
                await ValidateInfo(data);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            await _otpServices.SaveOtpAsync(data);
            return new ResponseDto<RegisterResponseDto>
            {
                statusCode = 201,
                message = Message.OTP_HAS_BEEN_SENT,
                data = null
            };
        }
        public virtual async Task<RegisterRequestDto> ValidateInfo(RegisterRequestDto data)
        {
            var checkEmailExist = await _accountRepository.GetAccountByEmail(data.email);
            var checkPhoneExist = await _accountRepository.GetAccountByPhoneAsync(data.phone);
            if (checkEmailExist != null) {
                if(checkEmailExist.Deleted_At != DateTime.MinValue)
                {
                    throw new Exception(Message.ACCOUNT_HAS_BEEN_DISABLED);
                }
                throw new Exception(Message.EMAIL_EXISTS);
            }
            if (checkPhoneExist != null)
            {
                throw new Exception(Message.PHONE_EXISTS);
            }
            if (!Regex.IsMatch(data.email, RegexPartterns.EMAIL_PATTERN))
            {
                throw new Exception(Message.INVALID_EMAIL);
            }
            if (!Regex.IsMatch(data.phone, RegexPartterns.PHONE_NUMBER_PATTERN))
            {
                throw new Exception(Message.INVALID_PHONE);
            }
            if (!Regex.IsMatch(data.password, RegexPartterns.PASSWORD_PATTERN))
            {
                throw new Exception(Message.WEAK_PASSWORD);
            }
            return data;
        }
        public async Task<AccountResponseDto> VerifyRegisterAsync(string email)
        {
            var data = await _otpServices.GetObjectData<RegisterRequestDto>(email);
            if (data is null)
                throw new Exception(Message.OTP_INVALID);
            else
            {
                return await RegisterAccountAsync(data);
            }
        }
        public virtual async Task<AccountResponseDto> RegisterAccountAsync(RegisterRequestDto data)
        {
            try
            {
                await ValidateInfo(data);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            var hashPassword = BCrypt.Net.BCrypt.HashPassword(data.password);
            var newAccount = new DataAccess.Entities.Account
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
            var createdAccount = await _accountRepository.GetAccountByEmail(newAccount.Email);
            return new AccountResponseDto
            {
                accountId = createdAccount.Id,
            };
        }
        public virtual async Task RegisterCustomerAsync(AccountResponseDto account)
        {
            var newCustomer = new Customer
            {
                AccountId = account.accountId,
                Rank = CustomerRankEnum.REGULAR,
            };
            await _customerRepository.AddAsync(newCustomer);
        }
        public async Task<int> RegisterEmployeeOrTechnicianAsync(EmployeeRegisterDto data)
        {
            var checkEmailExist = await _accountRepository.GetAccountByEmail(data.accountInfo.email);
            var checkPhoneExist = await _accountRepository.GetAccountByPhoneAsync(data.accountInfo.phone);
            if (checkEmailExist != null && checkEmailExist.Deleted_At != DateTime.MinValue)
            {
                throw new Exception(Message.ACCOUNT_HAS_BEEN_DISABLED);
            }
            if (checkEmailExist != null)
            {
                throw new Exception(Message.EMAIL_EXISTS);
            }
            if (checkPhoneExist != null)
            {
                throw new Exception(Message.PHONE_EXISTS);
            }
            if (!Regex.IsMatch(data.accountInfo.email, RegexPartterns.EMAIL_PATTERN))
            {
                throw new Exception(Message.INVALID_EMAIL);
            }
            if (!Regex.IsMatch(data.accountInfo.phone, RegexPartterns.PHONE_NUMBER_PATTERN))
            {
                throw new Exception(Message.INVALID_PHONE);
            }
            if (!Regex.IsMatch(data.accountInfo.password, RegexPartterns.PASSWORD_PATTERN))
            {
                throw new Exception(Message.WEAK_PASSWORD);
            }
            var newIdReturned = 0;
            var newAccount = new DataAccess.Entities.Account
            {
                Email = data.accountInfo.email,
                Phone = data.accountInfo.phone,
                Hash_Password = BCrypt.Net.BCrypt.HashPassword(data.accountInfo.password),
                Create_At = DateTime.UtcNow,
                Updated_At = DateTime.UtcNow,
                Deleted_At = DateTime.MinValue,
                Role = data.role,
                First_Name = data.accountInfo.firstName.Trim(),
                Last_Name = data.accountInfo.lastName.Trim(),
            };
            newAccount = await _accountRepository.AddAsync(newAccount);
            var newEmployee = new Employee
            {
                AccountId = newAccount.Id,
                CCCD = data.CCCD,
                Status = EmployeeStatusEnum.Available,
                Deleted_At = DateTime.MinValue,
                Updated_At = DateTime.UtcNow,
                Avatar = data.avatar,
            };
            var tmp = await _employeeRepository.AddAsync(newEmployee);
            newIdReturned = tmp.Id;
            if (data.role == RoleEnum.Technician)
            {
                var employee = await _employeeRepository.GetEmployeeByAccountId(newAccount.Id);
                var newTechnician = new Technician
                {
                    EmployeeId = employee.Id,
                    ExpYear = data.expYear,
                    Created_At = DateTime.UtcNow,
                };
                var tmp02 = await _technicianRepository.AddAsync(newTechnician);
                newIdReturned = tmp02.Id;
                tmp.TechnicianId = newIdReturned;
                await _employeeRepository.UpdateAsync(tmp);
            };
            return newIdReturned;
        }
        public async Task<ResponseDto<LoginResponseDto>> LoginAsync(LoginRequestDto data, HttpContext context)
        {
            var account = await _accountRepository.GetAccountByEmail(data.email);
            if (account is null)
            {
                throw new Exception(Message.ACCOUNT_NOT_FOUND);
            }
            if (account.Deleted_At != DateTime.MinValue)
            {
                throw new Exception(Message.ACCOUNT_HAS_BEEN_DISABLED);
            }
            if (!BCrypt.Net.BCrypt.Verify(data.password, account.Hash_Password))
            {
                throw new Exception(Message.LOGIN_FAILED);
            }
            return await GenerateTokenAsync(account, new ResponseDto<LoginResponseDto>(), context);
        }
        public async Task<ResponseDto<LoginResponseDto>> LoginGoogleAsync(string idToken, HttpContext context)
        {
            var payload = await _googleValidator.ValidateAsync(idToken);
            if (payload is null)
            {
                throw new Exception(Message.LOGIN_FAILED);
            }
            if (string.IsNullOrEmpty(payload.Email)) {
                throw new Exception(Message.LOGIN_FAILED);

            }

            var email = payload.Email;
            var first_name = payload.GivenName;
            var last_name = payload.FamilyName;
            var account = await _accountRepository.GetAccountByEmail(email);
            if (account is null)
            {
                var defaultPassword = _configuration["DefaultPassword:Google"] ?? "12345678@sa";
                var hashPassword = BCrypt.Net.BCrypt.HashPassword(defaultPassword);
                var newAccount = new DataAccess.Entities.Account
                {
                    Email = email,
                    Hash_Password = hashPassword,
                    Create_At = DateTime.UtcNow,
                    Updated_At = DateTime.UtcNow,
                    Deleted_At = DateTime.MinValue,
                    Role = RoleEnum.Customer,
                    First_Name = first_name,
                    Last_Name = last_name,
                };
                await _accountRepository.AddAsync(newAccount);
                account = await _accountRepository.GetAccountByEmail(newAccount.Email);
                await RegisterCustomerAsync(new AccountResponseDto
                {
                    accountId = account.Id,
                });
            }
            if (account.Deleted_At != DateTime.MinValue) {
                throw new Exception(Message.ACCOUNT_HAS_BEEN_DISABLED);
            }
            return await GenerateTokenAsync(account, new ResponseDto<LoginResponseDto>(), context);

        }
        public virtual async  Task<ResponseDto<LoginResponseDto>> GenerateTokenAsync(DataAccess.Entities.Account account, ResponseDto<LoginResponseDto> response, HttpContext context)
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

            response.statusCode = HttpStatus.OK;
            response.message = Message.LOGIN_SUCCESS;
            response.data = new LoginResponseDto
            {
                accessToken = accessToken
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
                throw new Exception(Message.REFRESH_TOKEN_NOT_PROVIDED);
            }

            var hash = _tokenServices.HashToken(token);
            var refreshToken = await _refreshTokenRepository.GetValidAsync(hash);
            if (refreshToken is null)
            {
                throw new Exception(Message.UNAUTHORIZED);
            }

            if (refreshToken.ExpiryDate < DateTime.UtcNow)
            {
                throw new Exception(Message.REFRESH_TOKEN_EXPIRED);
            }

            var account = await _accountRepository.GetByIdAsync(refreshToken.AccountId);
            if (account is null)
            {
                throw new Exception(Message.ACCOUNT_NOT_FOUND);
            }
            if (account.Deleted_At != DateTime.MinValue)
            {
                throw new Exception(Message.ACCOUNT_HAS_BEEN_DISABLED);
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
                accessToken = newAccessToken
            };
            return response;
        }
        public virtual void  SetRefreshCookie(HttpContext context, string refresh, DateTime expires)
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
            if (account.Deleted_At != DateTime.MinValue)
            {
                throw new Exception(Message.ACCOUNT_HAS_BEEN_DISABLED);
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

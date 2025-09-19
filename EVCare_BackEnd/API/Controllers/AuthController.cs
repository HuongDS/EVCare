using Application.Dtos;
using Application.Dtos.Login;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Register;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using DataAccess.Dtos.Others;
using Application.Services;
using DataAccess.Dtos.Employees;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Enums;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _authServices;
        private readonly INotificationServices _notificationServices;
        private readonly IOtpServices _otpServices;

        public AuthController(IAuthServices authServices, INotificationServices notificationServices, IOtpServices otpServices)
        {
            _authServices = authServices;
            _notificationServices = notificationServices;
            _otpServices = otpServices;
        }
        [HttpPost("/register")]
        public async Task<IActionResult> Register(RegisterRequestDto data)
        {
            try
            {
                var response = await _authServices.RegisterAsync(data);
                var otp = await _notificationServices.SendOTP(data.email, 5);
                await _otpServices.SaveOtpAsync(data.email, otp, 5);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = ex.Message.Equals(Message.ACCOUNT_EXISTS) ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                    data = null
                });
            }
        }
        [HttpPost("/verify-otp-register")]
        public async Task<IActionResult> VerifyOtpRegister(VerifyOTPRequestDto data)
        {
            var response = await _otpServices.VerifyOtpAsync(data.email, data.otp);
            if (!response)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = Message.OTP_INVALID,
                    data = null
                });
            }
            var res = await _authServices.VerifyRegisterAsync(data.email);
            await _authServices.RegisterCustomerAsync(res);
            return Ok(res);
        }
        [HttpPost("/register-for-employee")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterForEmployee(EmployeeRegisterDto data)
        {
            var account = await _authServices.RegisterAccountAsync(data.accountInfo);
            await _authServices.RegisterEmployeeOrTechnicianAsync(account, data);
            return Ok(account);
        }
        [HttpPost("/login")]
        public async Task<IActionResult> Login(LoginRequestDto data)
        {
            try
            {
                var response = await _authServices.LoginAsync(data, HttpContext);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Unauthorized(new ResponseDto<object>
                {
                    statusCode = ex.Message.Equals(Message.ACCOUNT_NOT_FOUND) ? HttpStatus.NOT_FOUND : HttpStatus.UNAUTHORIZED,
                    message = ex.Message,
                    data = null
                });
            }
        }
        [HttpPost("/login-google")]
        public async Task<IActionResult> GoogleCallback([FromBody] string IdToken)
        {
            try
            {
                var response = await _authServices.LoginGoogleAsync(IdToken, HttpContext);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Unauthorized(new ResponseDto<object>
                {
                    statusCode = ex.Message.Equals(Message.ACCOUNT_NOT_FOUND) ? HttpStatus.NOT_FOUND : HttpStatus.UNAUTHORIZED,
                    message = ex.Message,
                    data = null
                });
            }
        }
        [HttpPost("/logout")]
        public async Task<ResponseDto<object>> Logout()
        {
            await _authServices.LogoutAsync(HttpContext);
            return new ResponseDto<object>
            {
                statusCode = HttpStatus.OK,
                message = Message.LOGOUT_SUCCESS,
                data = null
            };
        }
        [HttpPost("/refresh")]
        public async Task<IActionResult> RefreshTokenAsync()
        {
            try
            {
                var response = await _authServices.RefreshAsync(HttpContext);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Unauthorized(new ResponseDto<object>
                {
                    statusCode = ex.Message.Equals(Message.ACCOUNT_NOT_FOUND) ? HttpStatus.NOT_FOUND : HttpStatus.UNAUTHORIZED,
                    message = ex.Message,
                    data = null
                });
            }
        }
        [HttpPost("/sent-otp")]
        public async Task<IActionResult> SendOTP(string email)
        {
            var otp = await _notificationServices.SendOTP(email, 5);
            await _otpServices.SaveOtpAsync(email, otp, 5);
            return Ok(new ResponseDto<object>
            {
                statusCode = HttpStatus.OK,
                message = Message.OTP_HAS_BEEN_SENT,
                data = null
            });
        }
        [HttpPost("/reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequestDto data)
        {
            var response = await _otpServices.VerifyOtpAsync(data.email, data.otp);
            if (!response)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = Message.OTP_INVALID,
                    data = null
                });
            }
            try
            {
                await _authServices.ResetPassword(data);
                return Ok(new ResponseDto<object>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.PASSWORD_RESET_SUCCESS,
                    data = null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = ex.Message.Equals(Message.ACCOUNT_NOT_FOUND) ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                    data = null
                });
            }
        }
    }
}

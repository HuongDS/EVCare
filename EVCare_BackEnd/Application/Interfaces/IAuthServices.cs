using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Dtos.Login;
using DataAccess.Dtos.Others;
using DataAccess.Dtos.Register;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IAuthServices
    {
        Task<ResponseDto<LoginResponseDto>> LoginAsync(LoginRequestDto data, HttpContext context);
        Task<ResponseDto<LoginResponseDto>> LoginGoogleAsync(string idToken, HttpContext context);
        Task LogoutAsync(HttpContext context);
        Task<ResponseDto<LoginResponseDto>> RefreshAsync(HttpContext context);
        Task<ResponseDto<RegisterResponseDto>> RegisterAsync(RegisterRequestDto data);
        Task ResetPassword(ResetPasswordRequestDto data);
        Task<ResponseDto<RegisterResponseDto>> VerifyRegisterAsync(string email, string otp);
    }
}

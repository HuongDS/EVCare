using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Dtos.Login;
using DataAccess.Dtos.Accounts;
using DataAccess.Dtos.Employees;
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
        Task<AccountResponseDto> RegisterAccountAsync(RegisterRequestDto data);
        Task<ResponseDto<RegisterResponseDto>> RegisterAsync(RegisterRequestDto data);
        Task RegisterCustomerAsync(AccountResponseDto account);
        Task RegisterEmployeeOrTechnicianAsync(EmployeeRegisterDto data);

        Task ResetPassword(ResetPasswordRequestDto data);
        Task<RegisterRequestDto> ValidateInfo(RegisterRequestDto data);
        Task<AccountResponseDto> VerifyRegisterAsync(string email);
    }
}

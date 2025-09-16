using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Register;

namespace Application.Interfaces
{
    public interface IOtpServices
    {
        Task<T?> GetObjectData<T>(string email) where T : class;
        Task<string?> GetOtpAsync(string email);
        Task SaveOtpAsync(string email, string otp, int expireMinutes);
        Task SaveOtpAsync(RegisterRequestDto data);
        Task<bool> VerifyOtpAsync(string email, string otp);
    }
}

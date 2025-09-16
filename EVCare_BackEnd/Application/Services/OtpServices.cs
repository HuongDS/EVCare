using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Register;
using StackExchange.Redis;
using static System.Net.WebRequestMethods;

namespace Application.Services
{
    public class OtpServices : IOtpServices
    {
        private readonly IDatabase _db;
        public OtpServices(IConnectionMultiplexer redis)
        {
            _db = redis.GetDatabase();
        }
        public string GenerateVerificationCode()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }
        public async Task SaveOtpAsync(string email, string otp, int expireMinutes)
        {
            var key = $"otp:{email}";
            await _db.StringSetAsync(key, otp, TimeSpan.FromMinutes(expireMinutes));
        }
        public async Task SaveOtpAsync(RegisterRequestDto data)
        {
            await _db.StringSetAsync(
            $"otp:register:{data.email}",
        JsonSerializer.Serialize(new { data.email, data.phone, data.password, data.firstName, data.lastName }),
        TimeSpan.FromMinutes(5)
    );
        }
        public async Task<T?> GetObjectData<T>(string email) where T : class
        {
            var key = $"otp:register:{email}";
            var value = await _db.StringGetAsync(key);
            return value.HasValue ? JsonSerializer.Deserialize<T>(value!) : null;
        }

        public async Task<string?> GetOtpAsync(string email)
        {
            var key = $"otp:{email}";
            return await _db.StringGetAsync(key);
        }
        public async Task<bool> VerifyOtpAsync(string email, string otp)
        {
            var key = $"otp:{email}";
            var storedOtp = await _db.StringGetAsync(key);
            if (storedOtp.HasValue && otp == storedOtp)
            {
                await _db.KeyDeleteAsync(key);
                return true;
            }
            return false;
        }
    }
}
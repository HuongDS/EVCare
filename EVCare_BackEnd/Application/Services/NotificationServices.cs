using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.Extensions.Configuration;
using NotificationApi.Server;
using NotificationApi.Server.Models;

namespace Application.Services
{
    public class NotificationServices : INotificationServices
    {
        private readonly IConfiguration _configuration;
        private readonly IOtpServices _otpServices;

        public NotificationServices(IConfiguration configuration, IOtpServices otpServices)
        {
            _configuration = configuration;
            _otpServices = otpServices;
        }

        public string GenerateVerificationCode()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        public async Task<string> SendOTP(string email, int expires)
        {
            var otp = GenerateVerificationCode();
            await _otpServices.SaveOtpAsync(email, otp, expires);
            var key01 = _configuration["NotificationAPI:key01"];
            var key02 = _configuration["NotificationAPI:key02"];
            var notificationApi = new NotificationApiServer(
              key01,
              key02,
              true
            );
            var user = new NotificationUser
            {
                Id = email,
                Email = email
            };
            var notification = new SendNotificationData
            {
                NotificationId = "send_otp",
                User = user,
                TemplateId = "send_otp_first_template",
                MergeTags = new Dictionary<string, object>
                {
                    { "code", otp },
                    { "expire_time", expires }
                }

            };
            await notificationApi.Send(notification);
            return otp;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Application.Helper;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Accounts;
using DataAccess.Dtos.Appointment;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.Payment;
using DataAccess.Dtos.Vehicle;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using NotificationApi.Server;
using NotificationApi.Server.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Services
{
    public class NotificationServices : INotificationServices
    {
        private readonly IConfiguration _configuration;
        private readonly IOtpServices _otpServices;
        private readonly IMapper _mapper;
        private readonly ILinkServices _linkServices;

        public NotificationServices(IConfiguration configuration, IOtpServices otpServices,
            IMapper mapper, ILinkServices linkServices)
        {
            _configuration = configuration;
            _otpServices = otpServices;
            _mapper = mapper;
            _linkServices = linkServices;
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
              key01!,
              key02!,
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
        public async Task SendAppointmentInforAsync(AppointmentViewDetailModel rawData)
        {
            var data = _mapper.Map<AppointmentInforToSentDto>(rawData);
            (data.ConfirmUrl, data.CancelUrl) = _linkServices.GenerateActionLinks(rawData.Id, data.customerId);
            var key01 = _configuration["NotificationAPI:key01"];
            var key02 = _configuration["NotificationAPI:key02"];
            var notificationApi = new NotificationApiServer(
             key01!,
             key02!,
             true
           );
            var user = new NotificationUser
            {
                Id = data.email,
                Email = data.email
            };
            var notification = new SendNotificationData
            {
                NotificationId = "send_email",
                User = user,
                TemplateId = "send_appointment_infor",
                MergeTags = new Dictionary<string, object>
                {
                     { "CenterName", data.CenterName },
                    { "AppointmentDate", data.AppointmentDate.ToString("dd/MM/yyyy") },
                    { "CustomerName", data.CustomerName },
                    { "CenterAddress", data.CenterAddress },
                    { "ServiceList", data.ServiceList },
                    { "Note", data.Note ?? "" },
                    { "ConfirmUrl", data.ConfirmUrl },
                    { "CancelUrl", data.CancelUrl }
                }
            };
            await notificationApi.Send(notification);
        }
        public async Task SendInvoiceToCustomer(InvoiceMailDto dto)
        {
            var key01 = _configuration["NotificationAPI:key01"];
            var key02 = _configuration["NotificationAPI:key02"];
            var notificationApi = new NotificationApiServer(key01!, key02!, true);
            var user = new NotificationUser
            {
                Email = dto.appointmentInfo.email,
                Id = dto.appointmentInfo.email
            };
            var notification = new SendNotificationData
            {
                NotificationId = "send_invoice",
                User = user,
                TemplateId = "send_invoice",
                MergeTags = new Dictionary<string, object>
                {
                    { "centerName", dto.centerInfo.centerName },
                    { "centerAddress", dto.centerInfo.centerAddress },
                    { "customerName", dto.appointmentInfo.CustomerName },
                    { "email", dto.appointmentInfo.email },
                    { "appointmentDate", dto.appointmentInfo.AppointmentDate.ToString("dd/MM/yyyy") },
                    { "serviceList", dto.appointmentInfo.ServiceList },
                    { "note", dto.appointmentInfo.Note ?? string.Empty },
                    { "orderParts", dto.orderParts.ToString()},
                    { "linkToPay", dto.linkToPay},
                    { "totalAmount", dto.totalAmount}
                }
            };
            await notificationApi.Send(notification);
        }

        public async Task SendEmailToRemider(VehicleReminderDto model)
        {
            var key03 = _configuration["NotificationAPI:key03"];
            var key04 = _configuration["NotificationAPI:key04"];
            var notificationApi = new NotificationApiServer(
                    key03!,
                    key04!,
                    true
                  );
            var user = new NotificationUser
            {
                Id = model.Email,
                Email = model.Email
            };
            var notification = new SendNotificationData
            {
                NotificationId = "service_appointment_reminder",
                User = user,
                TemplateId = "service_appointment_reminder",
                MergeTags = new Dictionary<string, object>
                {
                    { "CustomerName",  model.CustomerName },
                    { "LicensePlate", model.LicensePlate },
                    { "BookingUrl", "Evcare" },
                    { "Hotline", model.HotLine },
                    { "CompanyName", model.ServiceCenterName }
                }
            };
            await notificationApi.Send(notification);

        }
       
        public async Task SendPaymentPendingPickupEmailAsync(PaymentPendingPickupEmailModel model)
        {
            var key03 = _configuration["NotificationAPI:key03"];
            var key04 = _configuration["NotificationAPI:key04"];
            var notificationApi = new NotificationApiServer(
                    key03!,
                    key04!,
                    true
                  );
            var user = new NotificationUser
            {
                Id = model.Email,
                Email = model.Email
            };
            var notification = new SendNotificationData
            {
                NotificationId = "appointment_reminder",
                User = user,
                TemplateId = "appointment_reminder",
                MergeTags = new Dictionary<string, object>
                {
                    {"CustomerName",  model.CustomerName },
                    {"LicensePlate", model.LicensePlate },
                    {"ServiceCenterName", model.ServiceCenterName },
                    {"VehicleModel",model.VehicleModel },
                    {"ServiceList",FormatHelper.BuildServiceListPlain(model.ServiceList) },
                    {"Amount",FormatHelper.FormatAmount(model.Amount)},
                    {"OpenDate",model.OpenDate },
                    {"EndDate",model.CloseDate },
                    {"OpenTime",model.OpenTime },
                    {"CloseTime",model.CloseTime },
                    {"CompletedAt",FormatHelper.FormatLocalDateTime(model.CompletedAt) }
                }
            };
            await notificationApi.Send(notification);
        }

        public Task SendNewAccountNotificationAsync(AccountEmailViewModel accountEmailViewModel) {
            throw new NotImplementedException();
        }
    }
}

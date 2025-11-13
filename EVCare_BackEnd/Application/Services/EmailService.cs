using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Appointment;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.Payment;
using DataAccess.Dtos.Vehicle;
using Microsoft.Extensions.Configuration;
using Org.BouncyCastle.Asn1.Pkcs;

namespace Application.Services {
    public class EmailService : INotificationServices {
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;
        private readonly IOtpServices _otpServices;
        private readonly IMapper _mapper;
        private readonly ILinkServices _linkServices;
        public EmailService(IEmailSender emailSender, IConfiguration configuration, IOtpServices otpServices,
            IMapper mapper, ILinkServices linkServices) {
            _emailSender = emailSender;
            _configuration = configuration;
            _otpServices = otpServices;
            _mapper = mapper;
            _linkServices = linkServices;
        }
        private string LoadTemplate(string fileName) {
            var path = Path.Combine(AppContext.BaseDirectory, "EmailTemplates", fileName);

            if (!File.Exists(path))
                throw new FileNotFoundException($"Email template not found: {path}");

            return File.ReadAllText(path);
        }

        public string GenerateVerificationCode() {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        public Task SendAppointmentInforAsync(AppointmentViewDetailModel rawData) {
            var data = _mapper.Map<AppointmentInforToSentDto>(rawData);
            (data.ConfirmUrl, data.CancelUrl) = _linkServices.GenerateActionLinks(rawData.Id, data.customerId);
            string html = LoadTemplate("appointment_confirmation_template.html");

            html = html.Replace("{{CustomerName}}", data.CustomerName)
                       .Replace("{{AppointmentDate}}", data.AppointmentDate.ToString())
                       .Replace("{{Location}}", data.CenterAddress)
                       .Replace("{{Services}}", string.Join(", ", data.ServiceList))
                       .Replace("{{Note}}", data.Note ?? "")
                       .Replace("{{ConfirmUrl}}", data.ConfirmUrl)
                       .Replace("{{CancelUrl}}", data.CancelUrl)
                       .Replace("{{SericeCenterName}}", data.CenterName);
            return _emailSender.SendAsync(data.email, "Appointment Confirmation", html,$"Dear {data.CustomerName}, your appointment is scheduled on {data.AppointmentDate}.");
        }

        public async Task SendEmailToRemider(VehicleReminderDto model) {
            string html = LoadTemplate("maintenance_reminder_template.html");

            html = html.Replace("{{CustomerName}}", model.CustomerName)
                       .Replace("{{LicensePlate}}", model.LicensePlate)
                       .Replace("{{BookingUrl}}", "https://ev-care.netlify.app/service")
                       .Replace("{{Hotline}}", model.HotLine)
                       .Replace("{{CompanyName}}", model.ServiceCenterName);
            await _emailSender.SendAsync(model.Email, "Vehicle Maintenance Reminder", html,$"Dear {model.CustomerName}, this is a reminder for your vehicle maintenance.");

        }

        public Task SendInvoiceToCustomer(InvoiceMailDto dto) {
           string html = LoadTemplate("invoice_vnpay_template.html");
            html = html.Replace("{{customerName}}", dto.appointmentInfo.CustomerName)
                       .Replace("{{centerAddress}}", dto.appointmentInfo.CenterAddress)
                       .Replace("{{centerName}}", dto.appointmentInfo.CenterName)
                       .Replace("{{email}}", dto.appointmentInfo.email)
                       .Replace("{{appointmentDate}}", dto.appointmentInfo.AppointmentDate.ToString("dd/MM/yyyy"))
                       .Replace("{{serviceList}}", string.Join("<br>", dto.appointmentInfo.ServiceList))
                       .Replace("{{note}}", dto.appointmentInfo.Note ?? string.Empty)
                       .Replace("{{totalAmount}}", dto.totalAmount + " VND")
                       .Replace("{{productRows}}", dto.orderParts.ToString())
                       .Replace("{{linkToPay}}", dto.linkToPay);
            return _emailSender.SendAsync(dto.appointmentInfo.email, "Your Invoice from " + dto.appointmentInfo.CenterName, html,$"Dear {dto.appointmentInfo.CustomerName}, your invoice amount is {dto.totalAmount} VND.");
        }

        public async Task<string> SendOTP(string email, int expires) {
            string otp = GenerateVerificationCode();
            string html = LoadTemplate("otp_template.html");
            html = html.Replace("{{OTP_CODE}}", otp)
                       .Replace("{{EXPIRES_MINUTES}}", expires.ToString());
           await _emailSender.SendAsync(email, "Your OTP Code", html,$"Your otp code is {otp}");
          
            return otp;

        }

        public async Task SendPaymentPendingPickupEmailAsync(PaymentPendingPickupEmailModel model) {
            string html = LoadTemplate("pickup_ready_template.html");
            html = html.Replace("{{CustomerName}}", model.CustomerName)
                       .Replace("{{VehicleModel}}", model.VehicleModel)
                       .Replace("{{LicensePlate}}", model.LicensePlate)
                       .Replace("{{ServiceCenterName}}", model.ServiceCenterName)
                       .Replace("{{CompletedAt}}", model.CompletedAt.ToString("dd/MM/yyyy HH:mm"))
                       .Replace("{{ServiceList}}", string.Join("<br>", model.ServiceList))
                       .Replace("{{Amount}}", model.Amount.ToString("N0") + " VND")
                       .Replace("{{OpenDate}}", model.OpenDate.ToString())
                       .Replace("{{EndDate}}", model.CloseDate.ToString())
                       .Replace("{{OpenTime}}", model.OpenTime.ToString())
                       .Replace("{{CloseTime}}", model.CloseTime.ToString());
            await _emailSender.SendAsync(model.Email, "Your Vehicle is Ready for Pickup", html,$"Dear {model.CustomerName}, your vehicle is ready for pickup.");
        }
    }
}

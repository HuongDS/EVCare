using System;
using System.Collections.Generic;
using System.Linq;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;

using Microsoft.Extensions.Configuration;


namespace Application.Services {
    public class EmailSender : IEmailSender {
        private readonly string _host;
        private readonly int _port;
        private readonly string _username;
        private readonly string _password;
        private readonly string _from;
        private readonly string _fromName;
        private readonly bool _useStartTls;
        public EmailSender(IConfiguration cfg) {
            _host = cfg["Smtp:Host"] ?? "smtp.gmail.com";
            _port = int.TryParse(cfg["Smtp:Port"], out var p) ? p : 587;
            _username = cfg["Smtp:Username"] ?? throw new InvalidOperationException("Missing Smtp:Username");
            _password = cfg["Smtp:Password"]
                         ?? Environment.GetEnvironmentVariable("Smtp__Password")
                         ?? throw new InvalidOperationException("Missing Smtp:Password or env Smtp__Password");
            _from = cfg["Smtp:FromAddress"] ?? _username;
            _fromName = cfg["Smtp:FromName"] ?? "EVCare";
            _useStartTls = !bool.TryParse(cfg["Smtp:UseStartTls"], out var tls) || tls;
        }
        public async Task SendAsync(string to, string subject, string html, string? text = null) {
            var msg = new MimeMessage();
            msg.From.Add(new MailboxAddress(_fromName, _from));
            msg.To.Add(MailboxAddress.Parse(to));
            msg.Subject = subject;

            var body = new BodyBuilder { HtmlBody = html, TextBody = text ?? " " };
            msg.Body = body.ToMessageBody();

            using var smtp = new SmtpClient();
            var secure = _useStartTls ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto;
            await smtp.ConnectAsync(_host, _port, secure);
            await smtp.AuthenticateAsync(_username, _password);
            await smtp.SendAsync(msg);
            await smtp.DisconnectAsync(true);
        }
    }
}

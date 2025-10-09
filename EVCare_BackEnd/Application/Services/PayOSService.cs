using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Invoice;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Application.Services
{
    public class PayOSService : IPayOSService
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IPayOSGateWay _gw;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly IAppointmentRepository _appointmentRepository;
        public PayOSService(
            IInvoiceRepository invoiceRepository, IPayOSGateWay gw, IConfiguration configuration,
            IMapper mapper
            ,IAppointmentRepository appointmentRepository
            )
        {
            _invoiceRepository = invoiceRepository;
            _gw = gw;
            _mapper = mapper;
            _configuration = configuration;
            _appointmentRepository = appointmentRepository;
        }
        private string Cfg(string key) => _configuration[$"PayOS:{key}"] ?? "";
        public async Task<(string, long)> CreateCheckoutUrlAsync(InvoiceCreateModel model)
        {
            var orderCode = long.Parse($"{model.OrderId}{DateTimeOffset.UtcNow.ToUnixTimeSeconds() % 10000}");
            long amount = (long)decimal.Truncate(model.Total_Price);

            var returnUrl =  Cfg("ReturnUrl");
            var cancelUrl =  Cfg("CancelUrl");
            var (ok, url, raw) = await _gw.CreateAsync(
            orderCode, amount, $"Thanh toán hóa đơn #{model.OrderId}",
            returnUrl, cancelUrl);
            if (!ok) throw new Exception($"PayOS create failed: {raw}");
            if(url==null) throw new Exception("PayOS create failed: url is null");
            return (url, orderCode);

        }

        public async Task HandleWebhookAsync(string rawBody, string? headerSignature)
        {
            if (!_gw.Verify(rawBody, headerSignature)) return;
            dynamic p = JsonConvert.DeserializeObject(rawBody);
            string? oc = p?.data?.orderCode;     
            string? st = p?.data?.desc;
            if (string.IsNullOrWhiteSpace(oc)) return;
            var orderCode = long.Parse(oc);  
            
        }

        public async Task CancelPayOSOrder(int orderCode)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("x-client-id", Cfg("ClientId"));
            client.DefaultRequestHeaders.Add("x-api-key", Cfg("ApiKey"));

            var response = await client.DeleteAsync($"https://api-merchant.payos.vn/v2/payment-requests/{orderCode}");
            var result = await response.Content.ReadAsStringAsync();
        }
    }
}

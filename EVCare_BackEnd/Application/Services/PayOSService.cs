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
        public PayOSService(IInvoiceRepository invoiceRepository, IPayOSGateWay gw, IConfiguration configuration,IMapper mapper)
        {
            _invoiceRepository = invoiceRepository;
            _gw = gw;
            _mapper = mapper;
            _configuration = configuration;
        }
        private string Cfg(string key) => _configuration[$"PayOS:{key}"] ?? "";
        public async Task<string> CreateCheckoutUrlAsync(InvoiceCreateModel model)
        {
            var orderCode = model.OrderId;
            long amount = (long)decimal.Truncate(model.Total_Price);

            var returnUrl =  Cfg("ReturnUrl");
            var cancelUrl =  Cfg("CancelUrl");
            var (ok, url, raw) = await _gw.CreateAsync(
            orderCode, amount, $"Thanh toán hóa đơn #{model.OrderId}",
            returnUrl, cancelUrl);
            if (!ok) throw new Exception($"PayOS create failed: {raw}");
            return url ?? throw new Exception("PayOS missing checkoutUrl");

        }

        public async Task HandleWebhookAsync(string rawBody, string? headerSignature)
        {
            if (!_gw.Verify(rawBody, headerSignature)) return;
            dynamic p = JsonConvert.DeserializeObject(rawBody);
            string? oc = p?.data?.orderCode;     
            string? st = p?.data?.status;
            if (string.IsNullOrWhiteSpace(oc) || !oc.StartsWith("INV-")) return;
            if (!int.TryParse(oc[4..], out var invoiceId)) return;
            var invoice = await _invoiceRepository.GetInvoiceById(invoiceId);
            
            invoice.Updated_At = DateTime.Now;
            if (string.Equals(st, "SUCCESS", StringComparison.OrdinalIgnoreCase))
            {
                invoice.Status = DataAccess.Enums.PaymentStatusEnum.Completed;
                _invoiceRepository.UpdateAsync(invoice);
            }
            else
            {
                _invoiceRepository.DeleteAsync(invoice.Id);
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.Pagination;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IInvoiceService
    {
        Task<int> CreateInvoice(InvoiceCreateModel model);
        public Task<string> CreatePaymentUrl(HttpContext context, InvoiceCreateModel model);
        Task<string> CreatePayOSUrl(InvoiceCreateModel model);
        Task HandleWebhookAsync(string raw, string? sig);
        Task<IEnumerable<InvoiceViewModel>?> GetInvoicesByCustomerId(int customerId);
        public Task PaymentCallback(IQueryCollection query);
        Task SendMailToPayAsync(string paymentUrl, InvoiceCreateModel model);
        Task<decimal> GetRevenue(int year, int month);
        Task<PageResultDto<InvoiceViewModel>> GetRecentInVoices(InvoiceQueryDto model);
        Task CancelPayOSOrder(int orderId);
        Task<InvoiceViewModel> GetInvoiceByOrderId(int orderId);
        Task<byte[]> PrintInvoice(int orderId);
        Task<InvoiceDetailViewModel> GetInvoiceDetailByOrderIdAsync(int orderId);
    }
}

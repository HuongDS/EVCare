using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Invoice;

namespace Application.Interfaces
{
    public interface IPayOSService
    {
        public Task<string> CreateCheckoutUrlAsync(InvoiceCreateModel model);
        public Task HandleWebhookAsync(string rawBody, string? headerSignature);
    }
}

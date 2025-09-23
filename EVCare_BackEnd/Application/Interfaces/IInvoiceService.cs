using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Invoice;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IInvoiceService 
    {
        Task <int> CreateInvoice(InvoiceCreateModel model);
        public Task<string> CreatePaymentUrl(HttpContext context,InvoiceCreateModel model);
        public Task PaymentCallback(IQueryCollection query);


    }
}

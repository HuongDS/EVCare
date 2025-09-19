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
        public Task<string> CreatePaymentUrl(HttpContext context,InvoiceCreateModel model);
        public void PaymentCallback(IQueryCollection query);


    }
}

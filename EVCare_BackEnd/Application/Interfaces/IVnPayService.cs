using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.VnPay;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IVnPayService
    {
        public string CreatePaymentUrl(HttpContext context,InvoiceCreateModel model);
        VnPaymentResponseModel PaymentExecute(IQueryCollection collection);
    }
}

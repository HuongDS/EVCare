using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Invoice
{
    public class InvoiceCreateModel
    {   
        public int OrderId { get; set; }       
        public decimal Total_Price { get; set; }
        public PaymentMethodEnum Payment_Method { get; set; }

    }
}

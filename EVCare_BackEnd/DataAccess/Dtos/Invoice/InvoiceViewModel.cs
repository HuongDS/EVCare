using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Invoice
{
    public class InvoiceViewModel
    {
        public int id { get; set; }
        public DateTime appointmentDate { get; set; }
        public decimal totalPrice { get; set; }
        public PaymentMethodEnum paymentMethod { get; set; }
        public DateTime paymentDate { get; set; }
        public PaymentStatusEnum status { get; set; }
    }
}

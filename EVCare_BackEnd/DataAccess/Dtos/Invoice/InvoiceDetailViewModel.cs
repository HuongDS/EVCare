using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.OrderPart;
using DataAccess.Enums;

namespace DataAccess.Dtos.Invoice {
    public class InvoiceDetailViewModel {
        public int Id { get; set; }
        public DateTime PaymentDate { get; set; }
        public PaymentMethodEnum PaymentMethod { get; set; }
        public decimal SubTotal {  get; set; }
        public decimal Vat {  get; set; }
        public decimal Total { get; set; }
        public PaymentStatusEnum PaymentStatus { get; set; }
        public List<OrderPartViewInvoiceModel> PartItems { get; set; }
    }
}

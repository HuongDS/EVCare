using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.Part;
using DataAccess.Dtos.Service;

namespace DataAccess.Dtos.Invoice
{
    public class InvoicePrintDataModel
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } 
        public string VehicleLicensePlate { get; set; } 
        public DateTime AppointmentDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string PaymentMethod { get; set; } 
        public DateTime PaymentDate { get; set; }
        public List<ServiceViewFormModel> ServiceItems { get; set; } 
        public List<OrderPartViewInvoiceModel> PartItems { get; set; } 
    }
}

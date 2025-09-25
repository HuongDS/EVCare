using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Appointment;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.Others;

namespace DataAccess.Dtos.Invoice
{
    public class InvoiceMailDto
    {
        public ServiceCenterViewDto centerInfo { get; set; }
        public StringBuilder orderParts { get; set; }
        public AppointmentInforToSentDto appointmentInfo { get; set; }
        public string linkToPay { get; set; }
        public decimal totalAmount { get; set; }
    }
}

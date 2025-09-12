using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Order : IEntity, ICreate
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
        public OrderStatusEnum Status { get; set; }
        public DateTime Create_At { get; set; }
        public ICollection<OrderPart> OrderParts { get; set; }
        public ICollection<Invoice> Invoices { get; set; }
        public ICollection<TechnicianWorkingSession> TechnicianWorkingSessions { get; set; }
    }
}

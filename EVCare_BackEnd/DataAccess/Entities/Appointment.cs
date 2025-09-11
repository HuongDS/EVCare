using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Appointment : IEntity, ICreate, IDelete
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int EmployeeId { get; set; }
        public int VehicleId { get; set; }
        public string Image { get; set; }
        public DateTime Appointment_Date { get; set; }
        public AppointmentStatusEnum Status { get; set; }
        public DateTime Create_At { get; set; }
        public DateTime Deleted_At { get; set; }
    }
}

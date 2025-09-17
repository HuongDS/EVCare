using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentViewDetailModel
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public AppointmentStatusEnum Status { get; set; }
        public string? Note { get; set; }
        public string VehicleName { get; set; }
        public string VehiclePlateNumber { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string ? CustomerEmail { get; set; }
        public string? EmployeeName { get; set; }
        public int? OrderId { get; set; }
        public List<string> ImagesUrls { get; set; } = new();
        public List<string> Services { get; set; } = new();

    }
}

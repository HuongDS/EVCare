using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;
using DataAccess.Dtos.Technician;
using DataAccess.Enums;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentViewDetailModel
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public AppointmentStatusEnum Status { get; set; }
        public string? Note { get; set; }
        public int VehicleId { get; set; }
        public string VehicleName { get; set; }
        public string VehiclePlateNumber { get; set; }
        public bool IsNeedMantainance { get; set; }
        public string CustomerName { get; set; }
        public string PhoneNumber { get; set; }
        public string? CustomerEmail { get; set; }
        public string? EmployeeName { get; set; }
        public int? OrderId { get; set; }
        public OrderStatusEnum? OrderStatus { get; set; }
        public List<string> ImagesUrls { get; set; } = new();
        public List<ServiceViewFormModel> Services { get; set; } = new();
        public IEnumerable<TechnicianViewModel> Technicians { get; set; }

    }
}

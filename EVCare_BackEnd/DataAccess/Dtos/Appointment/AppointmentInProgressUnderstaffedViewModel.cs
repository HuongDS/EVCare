using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;
using DataAccess.Dtos.Technician;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentInProgressUnderstaffedViewModel
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string VehicleName { get; set; }
        public string VehiclePlateNumber { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string? CustomerEmail { get; set; }
       
        public IEnumerable<ServiceViewFormModel> Services { get; set; }
        public IEnumerable<TechnicianViewModel> Technicians { get; set; }
    }
}

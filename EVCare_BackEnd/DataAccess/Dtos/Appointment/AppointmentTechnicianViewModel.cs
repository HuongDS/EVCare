using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Part;
using DataAccess.Enums;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentTechnicianViewModel
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? VehicleModel { get; set; }
        public string CustomerName { get; set; }
        public string? PhoneNumber { get; set; }
        public string LicensePlate { get; set; }
        public List<string>? Services { get; set; }
        public int? OrderId { get; set; }
        public List<PartTechnicianViewModel>? Parts {  get; set; }
        public TechnicianWorkingSessionEnum Status { get; set; }
        public IEnumerable<string> AppointmentImages { get; set; }
    }
}

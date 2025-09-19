using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentViewModel
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }

        public string VehicleName { get; set; }
        public List<string> Services { get; set; }
        public string VehicleImageUrl { get; set; }
        public AppointmentStatusEnum Status { get; set; }
    }
}

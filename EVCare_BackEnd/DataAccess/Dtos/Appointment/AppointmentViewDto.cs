using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentViewDto
    {
        public int appointmentID { get; set; }
        public string customerName { get; set; }
        public string vehiclePlate { get; set; }
        public string customerPhone { get; set; }
        public string vehicleModel { get; set; }
        public string note { get; set; }
        public DateTime appointmentDate { get; set; }
        public string status { get; set; }
        public IEnumerable<string> services { get; set; }
        public string employeeName { get; set; }
        public IEnumerable<string> techinicianNames { get; set; }
    }
}

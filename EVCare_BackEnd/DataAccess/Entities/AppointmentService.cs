using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities
{
    public class AppointmentService
    {
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
    }
}

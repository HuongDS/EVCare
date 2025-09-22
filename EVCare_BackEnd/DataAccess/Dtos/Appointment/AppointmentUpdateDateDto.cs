using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentUpdateDateDto
    {
        public DateTime newDate { get; set; }
        public int appointmentId { get; set; }
    }
}

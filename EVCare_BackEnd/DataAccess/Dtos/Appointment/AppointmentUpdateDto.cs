using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentUpdateDto
    {
        public int appointmentID { get; set; }
        public AppointmentStatusEnum status { get; set; }
    }
}

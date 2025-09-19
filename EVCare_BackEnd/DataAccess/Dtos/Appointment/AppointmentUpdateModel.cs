using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentUpdateModel
    {
        public int AppointmentId { get; set; }
        public AppointmentStatusEnum Status { get; set; }
       
    }
}

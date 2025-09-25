using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentDailyCountModel
    {
        public DateOnly Date { get; set; }
        public int Count { get; set; }
    }
}

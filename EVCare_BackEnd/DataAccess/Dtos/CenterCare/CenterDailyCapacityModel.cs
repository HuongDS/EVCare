using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Appointment;

namespace DataAccess.Dtos.CenterCare
{
    public class CenterDailyCapacityModel
    {
        public int Capacity {  get; set; }
        public IEnumerable<AppointmentDailyCountModel> AppointmentDailyCountModels { get; set; }
    }
}

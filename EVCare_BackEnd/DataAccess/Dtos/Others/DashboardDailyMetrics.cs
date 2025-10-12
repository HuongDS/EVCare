using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Others
{
    public class DashboardDailyMetrics
    {
        public DateTime date { get; set; }
        public int appointmentCounts { get; set; }
        public int customerCounts { get; set; }
        public decimal revenue { get; set; }
        public int numberOfCancelAppointment { get; set; }
    }
}

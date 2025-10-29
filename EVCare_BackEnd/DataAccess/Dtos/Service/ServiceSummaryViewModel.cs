using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Service {
    public class ServiceSummaryViewModel {
        public int ServiceID { get; set; }
        public string ServiceName { get; set; }
        public int TotalAppointments { get; set; }
    }
}

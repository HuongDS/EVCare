using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Alerts
{
    public class AlertCreateDto
    {
        public int appointmentId { get; set; }
        public string message { get; set; }
    }
}

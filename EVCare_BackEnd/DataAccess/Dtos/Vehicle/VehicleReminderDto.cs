using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Vehicle
{
    public class VehicleReminderDto
    {
        public int Id {  get; set; }
        public string Email { get; set; }
        public string CustomerName { get; set; }
        public string ServiceCenterName { get; set; }
        public string LicensePlate { get; set; }
        public string HotLine { get; set; }
    }
}

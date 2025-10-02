using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Payment
{
    public class PaymentPendingPickupEmailModel
    {
        public string CustomerName { get; set; }
        public string VehicleModel { get; set; }
        public string LicensePlate { get; set; }
        public string ServiceList { get; set; }
        public string Amount { get; set; }                
        public DateTime CompletedAt { get; set; }
        public string ServiceCenterName { get; set; }
        public string OpenTime { get; set; }          
        public string CloseTime { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Payment
{
    public class PaymentPendingPickupEmailModel
    {
        public string Email { get; set; }
        public string CustomerName { get; set; }
        public string VehicleModel { get; set; }
        public string LicensePlate { get; set; }
        public List<string> ServiceList { get; set; }
        public decimal Amount { get; set; }                
        public DateTime CompletedAt { get; set; }
        public string ServiceCenterName { get; set; }
        public TimeSpan OpenTime { get; set; }          
        public TimeSpan CloseTime { get; set; }
        public string OpenDate {  get; set; }
        public string CloseDate { get; set; }

    }
}

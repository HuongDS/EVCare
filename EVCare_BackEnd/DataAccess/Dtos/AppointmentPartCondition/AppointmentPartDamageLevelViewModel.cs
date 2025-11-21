using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.AppointmentPartCondition {
    public class AppointmentPartDamageLevelViewModel {

        public int PartId { get; set; }
        public string PartName { get; set; }
        public string PartUrl { get; set; }
        public DamageLevelEnum DamageLevel { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public bool IsReplaced { get; set; }
    }
}

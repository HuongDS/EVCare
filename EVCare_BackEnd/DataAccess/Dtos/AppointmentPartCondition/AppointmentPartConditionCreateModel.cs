using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.AppointmentPartCondition {
    public class AppointmentPartConditionCreateModel {
        public int AppointmentId { get; set; }
        public IEnumerable<AppointmentPartDamageLevelCreateModel> PartDamageLevels { get; set; }
    }
}

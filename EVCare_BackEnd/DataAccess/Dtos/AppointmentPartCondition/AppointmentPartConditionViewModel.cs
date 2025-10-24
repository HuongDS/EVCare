using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.AppointmentPartCondition {
    public class AppointmentPartConditionViewModel {
        public int AppointmentId { get; set; }
        public List<AppointmentPartDamageLevelViewModel> PartDamageLevels { get; set; } = new();
    }
}

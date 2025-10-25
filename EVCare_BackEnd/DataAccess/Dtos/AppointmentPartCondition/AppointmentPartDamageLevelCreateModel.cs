using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.AppointmentPartCondition {
    public class AppointmentPartDamageLevelCreateModel {
        public int PartId { get; set; }
        public DamageLevelEnum LevelEnum { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Entities {
    public class AppointmentPartCondition {
        public int TechicianId { get; set; }
        public Technician Technician { get; set; }
        public int PartId { get; set; }
        public Part Part { get; set; }
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }

        public DamageLevelEnum Level { get; set; }
    }
}

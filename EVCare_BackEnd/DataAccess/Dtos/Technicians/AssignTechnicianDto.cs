using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Technicians
{
    public class AssignTechnicianDto
    {
        public int orderID { get; set; }
        public int technicianID { get; set; }
        public TechnicianWorkingSessionEnum status { get; set; } = TechnicianWorkingSessionEnum.InProgress;
        public DateTime startedTime { get; set; } = DateTime.UtcNow;
    }
}

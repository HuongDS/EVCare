using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Entities
{
    public class TechnicianWorkingSession
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public int TechnicianId { get; set; }
        public Technician Technician { get; set; }
        public TechnicianWorkingSessionEnum Status { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        
    }
}

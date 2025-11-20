using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.OrderPart {
    public class OrderPartUpdateTechnicianDto {
        public int PartId { get; set; }
        public int OldTechnicianId { get; set; }
        public int NewTechnicianId { get; set; }

    }
}

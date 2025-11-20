using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Technician {
    public class TechnicianPendingPartModel {
        public List<int> TechnicianIds { get; set; }
        public int OrderId { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.OrderPart {
    public class OrderPartUpdateTechnicianModel {
        public int OrderId { get; set; }
        public IEnumerable<OrderPartUpdateTechnicianDto> UpdateParts { get; set; }

    }
}

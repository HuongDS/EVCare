using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.OrderPart {
    public class OrderPartStatusUpdateModel {
        public int OrderId { get; set; }
        public int PartId { get; set; }
        public bool IsReplaced { get; set; }
    }
}

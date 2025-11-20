using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Part;

namespace DataAccess.Dtos.OrderDetailLog {
    public class OrderDetailLogViewModel {
        public int OrderId { get; set; }
        public IEnumerable<PartViewInOrderDetail> Parts { get; set; }

    }
}

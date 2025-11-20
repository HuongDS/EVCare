using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Part {
    public class PartViewInOrderDetail {
        public int PartId { get; set; }
        public string PartName { get; set; } = string.Empty;
        public IEnumerable<string> Message    { get; set; }

    }
}

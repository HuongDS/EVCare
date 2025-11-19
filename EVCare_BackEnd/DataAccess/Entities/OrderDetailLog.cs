using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities {
    public class OrderDetailLog {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public int PartId { get; set; }
        public Part Part { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime Created_At { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.OrderPart
{
    public class OrderPartViewModel
    {
        public int partID { get; set; }
        public string partName { get; set; }
        public int orderId { get; set; }
        public int quantity { get; set; }
        public decimal replacePrice { get; set; }

        public decimal price { get; set; }
    }
}

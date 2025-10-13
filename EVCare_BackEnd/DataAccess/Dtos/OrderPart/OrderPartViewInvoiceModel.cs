using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.OrderPart
{
    public class OrderPartViewInvoiceModel
    {
  
        public string PartName { get; set; }
        public decimal ReplacePrice { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
    }
}

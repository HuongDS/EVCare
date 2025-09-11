using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class OrderParts
    {
        public int PartId { get; set; }
        public int OrderId { get; set; }
        public int Quantity { get; set; }
    }
}

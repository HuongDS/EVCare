using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.OrderParts
{
    public class OrderPartUpdateModel
    {
        public int PartId { get; set; }
        public int TechnicianId { get; set; }
        public int Quantity { get; set; }
      
    }
}

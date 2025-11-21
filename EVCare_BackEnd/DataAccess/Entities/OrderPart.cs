using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class OrderPart
    {
        public int PartId { get; set; }
        public Part Part { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }    
        public int Quantity { get; set; }
        public int TechnicianId { get; set; }
        public Technician Technician { get; set; }
        public decimal Price { get; set; }
        public decimal ReplacementPrice { get; set; }
        public bool IsReplaced { get; set; }

    }
}

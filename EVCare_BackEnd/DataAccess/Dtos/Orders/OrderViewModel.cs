using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Part;

namespace DataAccess.Dtos.Orders
{
    public class OrderViewModel
    {
        public int Id { get; set; }
        public IEnumerable<PartTechnicianViewModel> Parts { get; set; }   

        public decimal Price { get; set; }
    }
}

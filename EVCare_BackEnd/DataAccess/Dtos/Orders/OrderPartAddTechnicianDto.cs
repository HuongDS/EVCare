using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Orders
{
    public class OrderPartAddTechnicianDto
    {
        public int partID { get; set; }
        public int orderId { get; set; }
        public int quantity { get; set; }

    }
}

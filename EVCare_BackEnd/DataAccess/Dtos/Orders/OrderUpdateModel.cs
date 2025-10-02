using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.OrderParts;
using DataAccess.Dtos.Part;

namespace DataAccess.Dtos.Orders
{
    public class OrderUpdateModel
    {
        public int Id { get; set; }
        public IEnumerable<OrderPartUpdateModel> OrderParts { get; set; }
    }
}

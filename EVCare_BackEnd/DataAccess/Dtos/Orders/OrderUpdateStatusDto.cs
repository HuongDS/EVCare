using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Orders
{
    public class OrderUpdateStatusDto
    {
        public int orderID { get; set; }
        public OrderStatusEnum status { get; set; }
    }
}

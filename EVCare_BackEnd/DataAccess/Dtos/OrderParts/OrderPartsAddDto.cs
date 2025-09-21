using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;

namespace DataAccess.Dtos.OrderParts
{
    public class OrderPartsAddDto
    {
        public List<OrderPartAddDto> listParts { get; set; }
        public int orderId { get; set; }
    }
}

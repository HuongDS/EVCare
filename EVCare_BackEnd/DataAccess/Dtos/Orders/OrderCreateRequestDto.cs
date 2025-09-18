using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Orders
{
    public class OrderCreateRequestDto
    {
        public int appointmentID { get; set; }
        public DateTime created_At { get; set; }
    }
}

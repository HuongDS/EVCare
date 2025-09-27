using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Customers
{
    public class CustomerViewDto
    {
        public int Id { get; set; }
        public string Address { get; set; }
        public CustomerRankEnum rank { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Vehicle;

namespace DataAccess.Dtos.Customers
{
    public class CustomerViewModel
    {
        public int AccountId { get; set; }
        public string CustomerName { get; set; }
        public bool Banned { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public IEnumerable<VehicleViewModel> Vehicles { get; set; }
        public int? CustomerId { get; set; }

    }
}

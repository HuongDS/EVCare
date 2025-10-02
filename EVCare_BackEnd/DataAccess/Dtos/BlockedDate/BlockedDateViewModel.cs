using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.BlockedDate
{
    public class BlockedDateViewModel
    {
        public DateOnly DateTime { get; set; }
        public string Reason { get; set; }
   
    }
}

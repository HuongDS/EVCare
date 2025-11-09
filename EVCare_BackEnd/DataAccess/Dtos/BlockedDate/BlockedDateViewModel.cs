using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.BlockedDate
{
    public class BlockedDateViewModel
    {
        public DateOnly DateTime { get; set; }
        public string Reason { get; set; }
        public UnavailableType UnavailableType { get; set; }

    }
}

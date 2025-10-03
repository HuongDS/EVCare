using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.AI
{
    public class ReplenishmentItem
    {
        public int PartId { get; set; }
        public string PartName { get; set; }
        public int MinStock { get; set; }
        public int NeedQuantity { get; set; }
        public string Reason { get; set; }

    }
}

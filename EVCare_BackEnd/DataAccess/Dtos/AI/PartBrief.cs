using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.AI
{
    public class PartBrief
    {
        public int PartId { get; set; }
        public string Name { get; set; }
        public int Stock { get; set; }
        public double AvgUse7d { get; set; }
        public double AvgUse30d { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Part;

namespace DataAccess.Dtos.OrderPart
{
     public class OrderPartAddModel
    {
        public int OrderId { get; set; }
        public IEnumerable<PartUpdateModel> Parts { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Part;

namespace DataAccess.Dtos.OrderPart
{
    public class TechnicianOrderPartUpdateModel
    {
        public int OrderId { get; set; }
        public int TechnicianId { get; set; }   
        public List<PartUpdateModel> Parts { get; set; }
    }
}

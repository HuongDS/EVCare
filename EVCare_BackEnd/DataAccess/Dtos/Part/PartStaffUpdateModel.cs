using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Part {
   public class PartStaffUpdateModel {
       
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal UnitPrice { get; set; }
        public int Stock { get; set; }
        public string Image { get; set; }


    }
}

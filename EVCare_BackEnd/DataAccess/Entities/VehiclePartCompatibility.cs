using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities {
    public class VehiclePartCompatibility {
        public int VehicleCategoryId { get; set; }
        public VehiclesCategory Vehicle { get; set; }
        public int PartCategoryId { get; set; }
        public PartCategory PartCategory { get; set; }

    }
}

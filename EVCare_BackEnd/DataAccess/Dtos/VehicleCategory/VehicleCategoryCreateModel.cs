using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.VehicleCategory {
    public class VehicleCategoryCreateModel {
        public string Name { get; set; }
        public string? Molder3DUrl { get; set; }
        public int[] PartCategoryIds { get; set; }
    }
}

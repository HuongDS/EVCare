using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.VehicleCategory {
    public class VehicleCategoryCreateModel {
        public string Name { get; set; }
        public string? Model3DUrl { get; set; }
        public decimal? ScaleX { get; set; }
        public decimal? ScaleY { get; set; }
        public decimal? ScaleZ { get; set; }
        public int[] PartCategoryIds { get; set; }
    }
}

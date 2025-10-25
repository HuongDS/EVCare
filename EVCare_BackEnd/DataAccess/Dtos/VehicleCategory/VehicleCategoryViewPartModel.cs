using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.PartCategory;

namespace DataAccess.Dtos.VehicleCategory {
    public class VehicleCategoryViewPartModel {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Model3DUrl { get; set; }

        public IEnumerable<string>PartCategoryNames { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Part;

namespace DataAccess.Dtos.PartCategory {
    public class PartCategoryAppointmentViewModel {
        public string PartCategoryName { get; set; }
        public IEnumerable<DamagedPartViewModel> DamagedPartViewModels { get; set; }
    }
}

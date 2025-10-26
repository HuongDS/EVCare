using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Part;

namespace DataAccess.Dtos.Appointment {
    public class AppointmentVehicleViewModel {
        public int Id { get; set; }
        public int VehicleCategoryId { get; set; }
        public IEnumerable<DamagedPartViewModel> DamagedPartViewModels { get; set; }
    }
}

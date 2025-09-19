using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Vehicle
{
    public class VehicleDetailViewModel
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string LicensePlate { get; set; }
        public string? Image { get; set; }
        public decimal? Last_Kilometer { get; set; }
        public DateTime? Last_Appointment { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Vehicle
{
    public class VehicleCreateModel
    {
        public int CategoryId { get; set; }
        public string LicensePlate { get; set; }
        public string? img { get; set; }
    }
}

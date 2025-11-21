using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class VehiclesCategory : IEntity, IDelete
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        public DateTime Deleted_At { get; set; }
        public string? Model3DUrl { get; set; }
        public decimal? ScaleX {  get; set; }
        public decimal? ScaleY { get; set; }
        public decimal? ScaleZ { get; set; }
        public ICollection<VehiclePartCompatibility>? VehiclePartCompatibilities { get; set; }
        public ICollection<Vehicle>? Vehicles { get; set; }
    }
}

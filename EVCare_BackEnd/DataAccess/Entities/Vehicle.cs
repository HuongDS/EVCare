using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Vehicle : IEntity, IDelete, ICategory
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public VehiclesCategory Category { get; set; }

        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
        public string? Image { get; set; }
        public decimal? Last_Kilometer { get; set; }
        public DateTime Last_Appointment { get; set; }
        public DateTime Deleted_At { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
    }
}

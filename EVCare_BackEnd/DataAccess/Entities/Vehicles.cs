using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Vehicles : IEntity, IDelete
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public int CustomerId { get; set; }
        public string Image { get; set; }
        public decimal LastKilometer { get; set; }
        public DateTime Last_Appointment { get; set; }
        public DateTime Deleted_At { get; set; }
    }
}

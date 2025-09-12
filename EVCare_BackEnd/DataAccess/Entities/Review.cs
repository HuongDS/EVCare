using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Review : IEntity, ICreate, IUpdate
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
        public string Content { get; set; }
        public DateTime Create_At { get; set; }
        public ICollection<ReviewEmployee> ReviewEmployees { get; set; }
        public DateTime Updated_At { get ; set ; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Alert : IEntity, ICreate
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
        public string Message { get; set; }
        public DateTime Create_At { get; set; }
        public bool Is_Read { get; set; }
    }
}

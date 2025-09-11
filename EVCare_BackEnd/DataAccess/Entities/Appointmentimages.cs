using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Appointmentimages : IEntity
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public string Image { get; set; }
    }
}

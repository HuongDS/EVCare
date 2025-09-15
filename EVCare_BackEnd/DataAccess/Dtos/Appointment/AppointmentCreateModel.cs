using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentCreateModel
    {
        public int CustomerId { get; set; }
        public int VehicleId { get; set; }
        public string? Note { get; set; }
        public DateTime Appointment_Date { get; set; }  
        public string[]? ImagesUrls { get; set; }
        public int[] ServiceIds { get; set; }


    }
}

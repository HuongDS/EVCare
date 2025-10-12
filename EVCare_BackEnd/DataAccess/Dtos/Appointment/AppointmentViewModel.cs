using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;
using DataAccess.Enums;
using Microsoft.Identity.Client;


namespace DataAccess.Dtos.Appointment
{
    public class AppointmentViewModel
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? VehicleModel { get; set; }
        public string CustomerName {  get; set; }
        public string? PhoneNumber { get; set; }
        public string LicensePlate { get; set; }
        public List<ServiceViewFormModel>? Services { get; set; }
        public List<string>? AppointmentImages { get; set; }
        public AppointmentStatusEnum Status { get; set; }

        public int? OrderId { get; set; }

        public string? Note { get; set; }
    }
}


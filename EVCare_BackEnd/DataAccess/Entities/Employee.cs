using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Employee : IEntity, IUpdate, IDelete
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public Account Account { get; set; }
        public string CCCD { get; set; }
        public EmployeeStatusEnum Status { get; set; }
        public DateTime Updated_At { get; set; }
        public DateTime Deleted_At { get; set; }
        public string? Avatar { get; set; }
        public ICollection<Application> Applications { get; set; }
      
        public int? TechnicianId { get; set; }
        public Technician? Technician { get; set; }
        public ICollection<Appointment> Appointments { get; set; }


    }
}

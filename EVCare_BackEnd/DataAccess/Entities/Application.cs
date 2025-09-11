using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Application : IEntity, ICreate
    {
        
        public int Id { get ; set ; }
           
        public DateTime DateOff { get; set; }   
        public string Reason { get; set; }
        public bool IsApproved { get; set; }
        public string? Note { get; set; }
        public DateTime Create_At { get; set ; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}

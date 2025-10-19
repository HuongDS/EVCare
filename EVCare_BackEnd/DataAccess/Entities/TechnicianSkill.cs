using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities
{
    public class TechnicianSkill
    {
       
        public int TechnicianId { get; set; }
        public Technician Technician { get; set; }  
        public int ServiceId { get; set; }  
        public Service Service { get; set; }
    }
}

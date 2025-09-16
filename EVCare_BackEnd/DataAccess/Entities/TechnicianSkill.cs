using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities
{
    public class TechnicianSkill
    {
        public int TechnicianCategoryId { get; set; }

        public TechnicianCategory TechnicianCategories { get; set; }
        public int TechnicianId { get; set; }
        public Technician Technician { get; set; }  
        public int ServiceId { get; set; }  
        public Service Service { get; set; }
    }
}

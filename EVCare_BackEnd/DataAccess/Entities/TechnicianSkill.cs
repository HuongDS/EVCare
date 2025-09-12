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
        public int ServiceCategoryId { get; set; }
        public ServiceCategory ServiceCategories { get; set; }
    }
}

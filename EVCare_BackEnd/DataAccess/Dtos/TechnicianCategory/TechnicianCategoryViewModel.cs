using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;

namespace DataAccess.Dtos.TechnicianCategory
{
    public class TechnicianCategoryViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public string Description { get; set; } 
        public bool IsDeleted { get; set;}
        public List<ServiceViewModel> Services { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Service : IEntity, ICreate, IUpdate
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Duration { get; set; }
        public DateTime Create_At { get; set; }
        public DateTime Updated_At { get; set; }
        public DateTime? Deleted_At { get; set; }
        public int ServiceCategoryId { get; set;}
        public ServiceCategory ServiceCategory { get; set;}
        public ICollection<TechnicianSkill> TechnicianSkills { get; set; }
    }

}

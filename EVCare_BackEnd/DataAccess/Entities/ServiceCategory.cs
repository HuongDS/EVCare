using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class ServiceCategory : IEntity, ICreate, IUpdate, IDelete
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Create_At { get; set; }
        public DateTime Updated_At { get; set; }
        public DateTime Deleted_At { get; set; }
        public ICollection<Service> Services { get; set; }
        public ICollection<TechnicianSkill> TechnicianSkills { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class TechnicianCategory : IEntity, IDelete
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Deleted_At { get; set; }
        //public ICollection<Technician> Technicians { get; set; }
        public ICollection<TechnicianSkill> TechnicianSkills { get; set; }

    }
}

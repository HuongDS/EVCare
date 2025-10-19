using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.TechnicianSkill
{
    public class TechnicianSkillCreateModel
    {
        public int TechnicianId { get; set; }
        public int TechnicianCategoryId { get; set; }
        public int? ServiceId { get; set;}
    }
}

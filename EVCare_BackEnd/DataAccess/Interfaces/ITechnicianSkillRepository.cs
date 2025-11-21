using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.TechnicianSkill;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface ITechnicianSkillRepository
    {
        Task AddTechnicianSkillAsync(IEnumerable<TechnicianSkill> model);
        Task DeleteTechnicianSkillByTechnicianIdAsync(int technicianId);
        Task SaveChangeAsynce();
    }
}

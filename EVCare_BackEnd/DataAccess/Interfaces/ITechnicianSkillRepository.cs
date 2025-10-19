using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.TechnicianSkill;

namespace DataAccess.Interfaces
{
    public interface ITechnicianSkillRepository
    {
        Task AddTechnicianSkillAsync(TechnicianSkillCreateModel model);
        Task<IEnumerable<int>> GetServiceIdsByCategoryIdAsync(int technicianCategoryId);
    }
}

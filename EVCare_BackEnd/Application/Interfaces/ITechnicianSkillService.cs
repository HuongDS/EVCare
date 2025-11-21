using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.TechnicianSkill;

namespace Application.Interfaces
{
    public interface ITechnicianSkillService
    {
        Task AddTechnicianSkillAsync(TechnicianSkillCreateModel model);
        Task UpdateTechnicianSkillAsync(TechnicianSkillCreateModel model);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.TechnicianSkill;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class TechnicianSkillRepository : ITechnicianSkillRepository
    {
        private readonly EVCareDbContext _dbContext;
        public TechnicianSkillRepository(EVCareDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddTechnicianSkillAsync(TechnicianSkillCreateModel model)
        {
            
            var entity = new TechnicianSkill
            {
                TechnicianId = model.TechnicianId,
                TechnicianCategoryId = model.TechnicianCategoryId,
                ServiceId = model.ServiceId.Value
            };
            await _dbContext.TechnicianSkills.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<int>> GetServiceIdsByCategoryIdAsync(int technicianCategoryId)
        {
            return await _dbContext.TechnicianSkills.Where(ts => ts.TechnicianCategoryId == technicianCategoryId)
                 .Select(ts => ts.ServiceId)
                 .Distinct().ToListAsync();
                
        }
    }
}

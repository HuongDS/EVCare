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

        public async Task AddTechnicianSkillAsync(IEnumerable<TechnicianSkill> model)
        {
            await _dbContext.TechnicianSkills.AddRangeAsync(model);
            
          
        }

        public async Task DeleteTechnicianSkillByTechnicianIdAsync(int technicianId) {
            await _dbContext.TechnicianSkills
                .Where(x => x.TechnicianId == technicianId)
                .ExecuteDeleteAsync();
        }

        public async Task SaveChangeAsynce() {
            await _dbContext.SaveChangesAsync();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Interfaces;

namespace DataAccess.Repositories
{
    public class TechnicianWorkingSessionRepository : ITechnicianWorkingSessionRepository
    {
        private readonly EVCareDbContext _dbContext;

        public TechnicianWorkingSessionRepository(EVCareDbContext dbContext)
        {
            this._dbContext = dbContext;
        }
        public async Task AssignTechnicianToOrder(TechnicianWorkingSession data)
        {
            await _dbContext.TechnicianWorkingSessions.AddAsync(data);
            await _dbContext.SaveChangesAsync();
        }
    }
}

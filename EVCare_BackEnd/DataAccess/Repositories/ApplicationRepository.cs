using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class ApplicationRepository : GenericRepository<DataAccess.Entities.Application>, IApplicationRepository
    {
        public ApplicationRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<bool> GetApplicationByEmployeeIDAndDateOffAsync(int employeeId, DateTime dateOff)
        {
            var application = await _dbSet.FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.DateOff.Date == dateOff.Date);
            return application == null;
        }

        public async Task<IEnumerable<DataAccess.Entities.Application>> GetApplicationsToday()
        {
            return await _dbSet
                .Where(x => DateOnly.FromDateTime(x.DateOff) == DateOnly.FromDateTime(DateTime.Now) && x.IsApproved == true)
                .ToListAsync();
        }
    }
}

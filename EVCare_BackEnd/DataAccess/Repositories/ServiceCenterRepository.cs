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
    public class ServiceCenterRepository : GenericRepository<ServiceCenter>, IServiceCenterRepository
    {
        public ServiceCenterRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<int> GetSlotLimitAsync()
        {
            var entity = await _dbSet.FirstOrDefaultAsync();
            if (entity == null)
            {
                throw new Exception($"Entity is not found.");
            }
            else
            {
                return entity.WorkSlot;
            }
        }
    }
}

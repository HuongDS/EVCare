using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class ServiceCenterRepository : IServiceCenterRepository
    {
        private readonly EVCareDbContext _dbContext;
        public ServiceCenterRepository(EVCareDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<int> GetAppactityOfServiceCenter()
        {
            var center = await _dbContext.ServiceCenters.FirstOrDefaultAsync();
            return center.Capacity;

        }

        public async Task<int> GetLimitBookingOfServiceCenter()
        {
            var center = await _dbContext.ServiceCenters.FirstOrDefaultAsync();
            return center.DailyBookingLimit;
        }
    }
}

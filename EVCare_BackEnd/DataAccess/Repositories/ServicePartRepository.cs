using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories {
    public class ServicePartRepository : IServicePartRepository {
        private readonly EVCareDbContext _dbContext;
        public ServicePartRepository(EVCareDbContext dbContext) {
            _dbContext = dbContext;
        }

        public async Task AddRangeAsync(int serviceId, IEnumerable<int> partIds) {
            
            var serviceParts = partIds.Select(partId => new Entities.ServicePart {
                ServiceId = serviceId,
                PartId = partId
            });
            await _dbContext.ServiceParts.AddRangeAsync(serviceParts);
           await  _dbContext.SaveChangesAsync();
        }

        public async Task DeleteByServiceIdAsync(int serviceId) {
           await _dbContext.ServiceParts.Where(sp => sp.ServiceId == serviceId)
                .ExecuteDeleteAsync();
        }
    }
}

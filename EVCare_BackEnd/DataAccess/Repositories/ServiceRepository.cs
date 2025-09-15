using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class ServiceRepository : GenericRepository<Service>, IServiceRepository
    {

        public ServiceRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<Service>> GetActiveServiceWithPagination(int payload, int pageIndex)
        {
            var services = await _dbSet
                .Where(s => s.Deleted_At == DateTime.MinValue)
                .Skip((pageIndex - 1) * payload)
                .Take(payload)
                .AsNoTracking().ToListAsync();
            return services;

        }

        public Task<IEnumerable> GetServiceWithCategoryIdAndPagination(int catgoryId, int payload, int pageIndex)
        {
            throw new NotImplementedException();
        }
    }
}

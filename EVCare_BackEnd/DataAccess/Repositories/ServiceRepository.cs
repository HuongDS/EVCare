using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

        public Task<IEnumerable> GetServiceWithCategoryIdAndPagination(int catgoryId, int payload, int pageIndex)
        {
            throw new NotImplementedException();
        }
    }
}

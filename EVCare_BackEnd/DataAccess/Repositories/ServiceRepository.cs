using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Service;
using DataAccess.Entities;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class ServiceRepository : GenericRepository<Service>, IServiceRepository
    {

        public ServiceRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PageResultDto<ServiceViewModel>> GetActiveServiceAndKeywordWithPagination(ServiceQueryDto model)
        {
            var query = _dbSet.Where(s => s.Deleted_At == DateTime.MinValue && s.Name.Contains(model.Keyword))
                .Select(x=>new ServiceViewModel
                {
                    Description = x.Description,
                    Duration = x.Duration,
                    Id = x.Id,
                    IsDeleted = false,
                    Name = x.Name,
                });
            query = query.ApplySorting(model.SortField, model.SortOrder);

            return await PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);
               
        }

        public async Task<IEnumerable<Service>> GetAllActiveServices(string keyword)
        {
            return await _dbSet.AsNoTracking() 
                .Where(s => s.Name.Contains(keyword) && s.Deleted_At==DateTime.MinValue).
                ToListAsync();
        }

        public async Task<PageResultDto<ServiceViewModel>> GetServiceAndKeywordWithPagination(ServiceQueryDto model)
        {
            var query = _dbSet.AsNoTracking()
                .Where(s => s.Name.Contains(model.Keyword)).Select(x => new ServiceViewModel
                {
                    Description = x.Description,
                    Duration = x.Duration,
                    Id = x.Id,
                    IsDeleted = false,
                    Name = x.Name,
                });
            query = query.ApplySorting(model.SortField, model.SortOrder);
            return await PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);
                 
        }

      
    }
}

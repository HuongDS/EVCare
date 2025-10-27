using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Service;
using DataAccess.Dtos.ServiceCategory;
using DataAccess.Entities;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class ServiceCategoryRepository : GenericRepository<ServiceCategory>,IServiceCategoryRepository
    {
        public ServiceCategoryRepository(EVCareDbContext dbContext) : base(dbContext) {
        }

        public async Task<IEnumerable<ServiceCategoryViewModel>> GetServiceCategoryAndService()
        {

            return await _dbContext.ServiceCategories 
                .Where(x=>x.Deleted_At==DateTime.MinValue)  
                .Select(sc => new ServiceCategoryViewModel
                { 
                    Name = sc.Name,
                    Services = sc.Services.Select(s => new ServiceViewFormModel
                    {
                        Id = s.Id,
                        Name = s.Name,
                    
                    }).ToList()

                }).ToListAsync();
        }

        public async Task<PageResultDto<ServiceCategoryViewDto>> GetSrvicecategoryViewDto(ServiceCategoryQueryDto model) {
            var query =_dbContext.ServiceCategories
                 .Where(x => x.Name.Contains(model.Name ?? string.Empty))
                 .Where(x => model.IsActive == null || (model.IsActive == true ? x.Deleted_At == DateTime.MinValue : x.Deleted_At != DateTime.MinValue))
                 .Select(sc => new ServiceCategoryViewDto
                 {
                     Id = sc.Id,
                     Name = sc.Name,
                     Description = sc.Description,
                     IsActive = sc.Deleted_At == DateTime.MinValue
                 }).ApplySorting(model.SortField,model.SortOrder);
            return await PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);


        }
    }
}

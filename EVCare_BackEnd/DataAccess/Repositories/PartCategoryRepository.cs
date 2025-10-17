using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.PartCategory;
using DataAccess.Entities;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class PartCategoryRepository : GenericRepository<PartCategory>, IPartCategoryRepository
    {
        public PartCategoryRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task Delete(int id)
        {
            await _dbContext.PartCategories
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.Deleted_At, p => DateTime.Now));
        }

        public async Task<PageResultDto<PartCategoryViewModel>> GetCategories(CategoryQueryDto model)
        {
            var query =  _dbContext.PartCategories.AsNoTracking()
                .Select(x => new PartCategoryViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    IsDeleted = x.Deleted_At != DateTime.MinValue

                }).ApplySorting(model.SortField, model.SortOrder);

            return await PaginationHelper.PaginationAsync(query,model.PageSize.Value, model.PageIndex.Value);

        }
    }
}

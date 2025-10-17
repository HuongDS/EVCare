using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.TechnicianCategory;
using DataAccess.Entities;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class TechnicianCategoryRepository : GenericRepository<TechnicianCategory>, ITechnicianCategoryRepository
    {
        public TechnicianCategoryRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public Task<PageResultDto<TechnicianCategoryViewModel>> GetAllTechnicianCategories(TechnicianCategoryDto model)
        {
            var query = _dbContext.TechnicianCategories.
                Select(tc => new TechnicianCategoryViewModel
                {
                    Id = tc.Id,
                    Name = tc.Name,
                    Description = tc.Description,
                    IsDeleted = tc.Deleted_At != DateTime.MinValue
                });
            if (!string.IsNullOrEmpty(model.Name))
            {
                query = query.Where(tc => tc.Name.Contains(model.Name.Trim()));
            }
            query = query.ApplySorting(model.SortField, model.SortOrder);
            return PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);
        }
    }


}

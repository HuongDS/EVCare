using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.PartHistory;
using DataAccess.Entities;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories {
    public class PartHistoryRepository : GenericRepository<PartHistory>, IPartHistoryRepository {
        public PartHistoryRepository(EVCareDbContext dbContext) : base(dbContext) {
        }
        public override async Task<PartHistory> AddAsync(PartHistory entity) {
            await _dbContext.PartHistories.AddAsync(entity);
            return entity;
        }

        public async Task<PageResultDto<PartHistoryViewModel>> GetPartUsageHistoriesAsync(PartHistoryQueryDto model) {
            var query = _dbContext.PartHistories.AsNoTracking()
                .Include(x => x.Part).ThenInclude(pc => pc.Category).AsQueryable();
            if(model.FromDate.HasValue) {
                 query  = query.Where(query => DateOnly.FromDateTime(query.ChangeDate) >= model.FromDate.Value);
            }
            if(model.ToDate.HasValue) {
                 query  = query.Where(query => DateOnly.FromDateTime(query.ChangeDate) <= model.ToDate.Value);
            }
            if(!string.IsNullOrEmpty(model.Keyword)) {
                 query  = query.Where(query => query.Part.Name.Contains(model.Keyword));
                 query = query.Where(query => query.EmployeeName.Contains(model.Keyword));
            }
            if(model.ActionType.HasValue) {
                 query  = query.Where(query => query.ActionType == model.ActionType.Value);
            }
            var query1 = query.Select(x => new PartHistoryViewModel
            {
                PartName = x.Part.Name,
                PartCategoryName = x.Part.Category.Name,
                ImageUrl = x.Part.Image,
                EmployeeName = x.EmployeeName,
                ActionType = x.ActionType,
                ChangeDate = x.ChangeDate,
                OldQuantity = x.OldQuantity,
                NewQuantity = x.NewQuantity,
                OldUnitPrice = x.OldUnitPrice,
                NewUnitPrice = x.NewUnitPrice,
                OldReplacePrice = x.OldReplacePrice,
                NewReplacePrice = x.NewReplacePrice
            }).ApplySorting(model.SortField,model.SortOrder);
            return await PaginationHelper.PaginationAsync(query1,model.PageSize.Value, model.PageIndex.Value);

        }
    }
}

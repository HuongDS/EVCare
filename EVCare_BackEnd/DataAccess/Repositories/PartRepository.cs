using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Entities;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class PartRepository : GenericCategoryRepository<Part>, IPartRepository
    {
        public PartRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<bool> CheckExist(int partId)
        {
            return await _dbSet.AnyAsync(x => x.Id == partId);
        }
        public Task<PageResultDto<PartViewModel>> GetAllParts(PartQueryDto model)
        {
            var query = _dbContext.Parts.AsNoTracking()
                .Where(x => x.Name.Contains(model.PartName))
                .Select(x => new PartViewModel
                 {
                     Id = x.Id,
                     Name = x.Name,
                     CategoryId = x.CategoryId,
                     IsDeleted = (x.Deleted_At != DateTime.MinValue),
                     Price = x.Price,
                     Quantity = x.Stock,
                     ImageUrl = x.Image,
                 });
            if (model.CategpryId.HasValue) query = query.Where(x => x.CategoryId == model.CategpryId.Value);

            query = query.ApplySorting(model.SortField, model.SortOrder);
            return PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);
        }

        public void Update(Part part)
        {
            _dbContext.Update(part);
        }

        public async Task UpdateStockPartAsync(int partID, int quantity)
        {
            var part = await GetByIdAsync(partID);
            if (part is null)
            {
                throw new Exception($"Part with id = {partID} not found");
            }
            var stock = part.Stock;
            if (stock < quantity)
            {
                throw new Exception($"Insufficient stock (stock = {stock})");
            }
            part.Stock = stock - quantity;
            await UpdateAsync(part);
        }
    }
}

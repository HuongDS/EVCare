using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
    public class PartRepository : GenericRepository<Part>, IPartRepository
    {
        public PartRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<bool> CheckExist(int partId)
        {
            return await _dbSet.AnyAsync(x => x.Id == partId);
        }
        public override async Task<Part> AddAsync(Part entity) {
            await _dbContext.Parts.AddAsync(entity);
            return entity;
        }
        public async Task DeleteByCategoryId(int id)
        {
           await _dbContext.Parts.Where(x=>x.CategoryId == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(p => p.Deleted_At, DateTime.Now)
                );
        }
        public override  Task<Part> UpdateAsync(Part entity) {
             _dbContext.Parts.Update(entity);
            return Task.FromResult(entity);
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
                     Description = x.Description,
                     ReplacementPrice = x.ReplacementPrice
                });
            if (model.CategoryIds!=null) query = query.Where(x=>model.CategoryIds.Contains(x.CategoryId));
           

            query = query.ApplySorting(model.SortField, model.SortOrder);
            return PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);
        }

        public async Task<IEnumerable<Part>> GetAllWithCategory()
        {
            return await _dbContext.Parts.Include(x => x.Category).AsNoTracking().ToListAsync();
        }

        public async Task<Dictionary<int,Part>> GetPartWithIDs(List<int> partIds)
        {
            return await _dbContext.Parts.Where(x=>partIds.Contains(x.Id)).ToDictionaryAsync(p=>p.Id);
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

        public async Task<IEnumerable<int>> GetPartIdsByCategoryId(int id) {
            return await _dbContext.Parts
                .Where(x => x.CategoryId == id)
                .Select(x => x.Id)
                .ToListAsync();
        }

        public async Task<Part> GetByNameAsync(string name) {
            return await _dbContext.Parts.Where(x => x.Name.ToLower() == name.ToLower()).FirstOrDefaultAsync();
        }

        public async Task<decimal> GetTotalPriceOfParts() {
            return await _dbContext.Parts.SumAsync(x => x.Price * x.Stock);
        }

        public async Task<IEnumerable<PartViewModel>> GetLowStockParts() {
            return await _dbContext.Parts
                .Where(x => x.Stock <=10 && x.Deleted_At == DateTime.MinValue)
                .Select(x => new PartViewModel {
                    Id = x.Id,
                    Name = x.Name,
                    CategoryId = x.CategoryId,
                    IsDeleted = (x.Deleted_At != DateTime.MinValue),
                    Price = x.Price,
                    Quantity = x.Stock,
                    ImageUrl = x.Image,
                    Description = x.Description,
                    ReplacementPrice = x.ReplacementPrice
                })
                .ToListAsync();
        }

        public Task<PageResultDto<PartViewModel>> GetPartsForService(PartForServiceQueryDto model) {



            var query = _dbContext.ServiceParts.AsNoTracking()
                .Where(model.ServiceIds != null ? x => model.ServiceIds.Contains(x.ServiceId) : x => true)
                .Include(x => x.Part)
                 .Select(x => x.Part)
                 .Distinct()
                .Select(p => new PartViewModel
                {
                    Id = p.Id,
                    Name = p.Name,
                    CategoryId = p.CategoryId,
                    IsDeleted = p.Deleted_At != DateTime.MinValue,
                    Price = p.Price,
                    Quantity = p.Stock,
                    ImageUrl = p.Image,
                    Description = p.Description,
                    ReplacementPrice = p.ReplacementPrice,
                });
                
            if(model.KeyWord!=null)
            {
                query = query.Where(x => x.Name.ToLower().Contains(model.KeyWord.ToLower()));
            }
            query = query.ApplySorting(model.SortField, model.SortOrder);
            return PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);
        }

        public async Task<PageResultDto<PartViewModel>> GetPartsForAppointmentId(PartForServiceQueryDto model) {
            var serviceIds = await _dbContext.AppointmentServices
         .Where(x => x.AppointmentId == model.AppointmentId)
         .Select(x => x.ServiceId)
         .ToListAsync();
            var query = _dbContext.ServiceParts.AsNoTracking()
                       
                        .Select(x => x.Part)         
                        .Distinct()                   
                        .Select(p => new PartViewModel
                        {
                            Id = p.Id,
                            Name = p.Name,
                            CategoryId = p.CategoryId,
                            IsDeleted = p.Deleted_At != DateTime.MinValue,
                            Price = p.Price,
                            Quantity = p.Stock,
                            ImageUrl = p.Image,
                            Description = p.Description,
                            ReplacementPrice = p.ReplacementPrice,
                          
                        });

            if(model.KeyWord!=null)
            {
                query = query.Where(x => x.Name.ToLower().Contains(model.KeyWord.ToLower()));
            }
            query = query.ApplyDynamicSorting(model.SortField, model.SortOrder);
            return await PaginationHelper.PaginationAsync(
                       query,
                       model.PageSize.Value,
                       model.PageIndex.Value
                   );
        }
    }
}

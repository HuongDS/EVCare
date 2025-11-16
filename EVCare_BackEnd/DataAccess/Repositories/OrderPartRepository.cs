using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.AI;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.OrderParts;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class OrderPartRepository : IOrderPartRepository
    {
        private readonly EVCareDbContext _dbContext;

        public OrderPartRepository(EVCareDbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        public async Task AddRange(IEnumerable<OrderPart> orderPartLists)
        {
            await _dbContext.AddRangeAsync(orderPartLists);
        }

        public async Task AddRangeAsync(List<OrderPart> orderParts)
        {
            foreach (var orderPart in orderParts)
            {
                var exist = await _dbContext.OrderParts.FirstOrDefaultAsync(o => o.OrderId == orderPart.OrderId
                && o.TechnicianId == orderPart.TechnicianId
                && o.PartId == orderPart.PartId);
                if (exist != null)
                {
                    exist.Quantity += orderPart.Quantity;
                    _dbContext.Update(exist);
                }
                else
                {
                    await _dbContext.AddAsync(orderPart);
                }
            }
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<OrderPart>> GetOrderPart(int orderId, int technicianId)
        {
            return await _dbContext.OrderParts.Where(x => x.OrderId == orderId && x.TechnicianId == technicianId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<OrderPart> GetOrderPartByOrderIdAndPartId(int orderId, int partId, int technicianId) {
           return await _dbContext.OrderParts
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.OrderId == orderId && x.PartId == partId && x.TechnicianId == technicianId);
        }

        public async Task<IEnumerable<OrderPartViewModel>> GetOrderPartViewModelAsync(int orderId)
        {
            var result = await _dbContext.OrderParts.Include(o => o.Part).Where(o => o.OrderId == orderId).Select(o => new OrderPartViewModel
            {
                partID = o.PartId,
                orderId = o.OrderId,
                quantity = o.Quantity,
                price = o.Price,
                partName = o.Part.Name,
                replacePrice = o.Part.ReplacementPrice
            }).ToListAsync();
            return result;
        }

        public async Task<IEnumerable<OrderPartViewModel>> GetOrdersForTechnicianAsync(int technicianId, int orderId) {
            return await _dbContext.OrderParts
                .AsNoTracking()
                .Include(x => x.Part)
                .Where(x => x.TechnicianId == technicianId && x.OrderId == orderId)
                .Select(x => new OrderPartViewModel {
                    partID = x.PartId,
                    partName = x.Part.Name,
                    orderId = x.OrderId,
                    quantity = x.Quantity,
                    price = x.Price,
                    replacePrice = x.Part.ReplacementPrice
                })
                .ToListAsync();
        }

        public async Task<List<PartBrief>> GetPartBriefs()
        {
            var today = DateTime.Now.Date;
            var from7 = today.AddDays(-7);
            var from30 = today.AddDays(-30);

            var used7 = await _dbContext.OrderParts
                        .AsNoTracking()
                        .Include(x => x.Order)
                        .Include(x => x.Part)
                        .Where(x => x.Order.Create_At >= from7)
                        .GroupBy(x => x.PartId)
                        .Select(g => new
                        {
                            g.Key,
                            Sum = g.Sum(x => x.Quantity)
                        }).ToDictionaryAsync(g=>g.Key,g=>(double)g.Sum);
            var used30 = await _dbContext.OrderParts
                        .AsNoTracking()
                        .Include(x => x.Order)
                        .Include(x => x.Part)
                        .Where(x => x.Order.Create_At >= from30)
                        .GroupBy(x => x.PartId)
                        .Select(g => new
                        {
                            g.Key,
                            Sum = g.Sum(x => x.Quantity)
                        }).ToDictionaryAsync(g => g.Key, g => (double)g.Sum);

            var parts = await _dbContext.Parts.Select(p => new { p.Id, p.Name, p.Stock }).ToListAsync();

            return parts.Select(p =>
            {
                double s7 = 0; used7.TryGetValue(p.Id, out s7);
                double s30 = 0; used30.TryGetValue(p.Id, out s30);
                return new PartBrief { PartId = p.Id, Name = p.Name, Stock = p.Stock, AvgUse7d = s7 / 7d, AvgUse30d = s30 / 30d };
            }).ToList();

        }

        public async Task<IEnumerable<int>> GetPartByOrderId(int orderId) {
            return await _dbContext.OrderParts
                .AsNoTracking()
                .Where(x => x.OrderId == orderId)
                .Select(x => x.PartId)
                .ToListAsync();
        }

        public async Task<List<int>> GetPartIdsInAppointmentByTechId(int orderId, int technician) {
            return await _dbContext.OrderParts
                .AsNoTracking()
                .Where(x => x.OrderId == orderId && x.TechnicianId == technician)
                .Select(x => x.PartId)
                .ToListAsync();
        }

        public async Task<IEnumerable<PartSummaryViewModel>> GetTopParts(PartSummaryQueryDto model) {
            var query = _dbContext.OrderParts
                .AsNoTracking()
                .Include(x => x.Part)
                .Include(x=>x.Order)
                .AsQueryable();
            if (model.FromDate.HasValue) {
                query = query.Where(x => DateOnly.FromDateTime(x.Order.Create_At.Date) >= model.FromDate.Value);

            }
            if (model.ToDate.HasValue) {
                query = query.Where(x => DateOnly.FromDateTime(x.Order.Create_At.Date) <= model.ToDate.Value);
            }
            var grouped = query
                .GroupBy(x => new { x.PartId, x.Part.Name, x.Part.Image })
                .Select(g => new PartSummaryViewModel {
                    PartName = g.Key.Name,
                    ImageUrl = g.Key.Image,
                    TotalUsed = g.Sum(x => x.Quantity)
                })
                .OrderByDescending(x => x.TotalUsed);
            if (model.Top.HasValue) {
                return await grouped.Take(model.Top.Value).ToListAsync();
            }
            return await grouped.ToListAsync();
        }
        

        public async Task RemoveRange(int orderId, int technicianId)
        {
            await _dbContext.OrderParts.Where(x => x.OrderId == orderId && x.TechnicianId == technicianId).ExecuteDeleteAsync();
        }

        public async Task UpdateAsync(OrderPart orderPart) {
            _dbContext.Update(orderPart);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateCompletedStatusByOrderIdAndTechnicianId(int orderId, int technician) {
            await _dbContext.OrderParts
                .Where(x => x.OrderId == orderId && x.TechnicianId == technician)
                .ExecuteUpdateAsync(o => o.SetProperty(x => x.IsReplaced, true));
        }
    }
}

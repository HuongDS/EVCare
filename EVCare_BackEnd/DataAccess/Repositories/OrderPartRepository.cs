using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.AI;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.OrderParts;
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
        public async Task<IEnumerable<OrderPartViewModel>> GetOrderPartViewModelAsync(int orderId)
        {
            var result = await _dbContext.OrderParts.Include(o => o.Part).Where(o => o.OrderId == orderId).Select(o => new OrderPartViewModel
            {
                partID = o.PartId,
                orderId = o.OrderId,
                quantity = o.Quantity,
                price = o.Price,
                partName = o.Part.Name,
            }).ToListAsync();
            return result;
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

            return await _dbContext.Parts.Select(x => new PartBrief
            {
                PartId = x.Id,
                Name = x.Name,
                Stock = x.Stock,
                AvgUse7d = (used7.TryGetValue(x.Id, out var s7) ? s7 : 0) / 7,
                AvgUse30d = (used30.TryGetValue(x.Id, out var s30) ? s30 : 0) / 30

            }).ToListAsync();

        }
    }
}

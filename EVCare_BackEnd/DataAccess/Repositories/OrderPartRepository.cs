using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
    }
}

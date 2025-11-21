using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.OrderDetailLog;
using DataAccess.Dtos.Part;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories {
    public class OrderDetailLogRepository : GenericRepository<OrderDetailLog>, IOrderDetailLogRepository {
        public OrderDetailLogRepository(EVCareDbContext dbContext) : base(dbContext) {
        }

        public async Task<OrderDetailLogViewModel> GetLogByOrderId(int orderId) {
            var query = await _dbContext.OrderDetailLogs.AsNoTracking()
                  .Where(o => o.OrderId == orderId)
                  .Include(x => x.Part)
                   .GroupBy(o => o.PartId)
                   .Select(g => new PartViewInOrderDetail
                   {
                       PartId = g.Key,
                       PartName = g.First().Part.Name,
                       Message = g.Select(o => o.Message).ToList(),

                   }).ToListAsync();
            return new OrderDetailLogViewModel
            {
                OrderId = orderId,
                Parts = query.ToList(),
            };
        }
    }
}

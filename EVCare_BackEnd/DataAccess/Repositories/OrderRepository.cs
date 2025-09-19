using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<int> GetCustomerIdByOrderId(int orderId)
        {
            return await _dbContext.Orders.Where(o => o.Id == orderId)
                .Include(o=>o.Appointment)
                .Select(o => o.Appointment.CustomerId)
                .FirstOrDefaultAsync();
        }
    }
}

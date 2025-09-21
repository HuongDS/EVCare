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
    public class OrderPartRepository : IOrderPartRepository
    {
        private readonly EVCareDbContext _dbContext;

        public OrderPartRepository(EVCareDbContext dbContext)
        {
            this._dbContext = dbContext;
        }
        public async Task AddRangeAsync(List<OrderPart> orderParts)
        {
            await _dbContext.OrderParts.AddRangeAsync(orderParts);
            await _dbContext.SaveChangesAsync();
        }
    }
}

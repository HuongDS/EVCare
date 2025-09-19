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
    public class PartRepository : GenericCategoryRepository<Part>, IPartRepository
    {
        public PartRepository(EVCareDbContext dbContext) : base(dbContext)
        {
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

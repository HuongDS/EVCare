using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class GenericCategoryRepository<T> : GenericRepository<T>, IGenericCategoryRepository<T> where T : class, ICategory, IEntity
    {
        public GenericCategoryRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<T>> GetByCategoryIdAsync(int categoryId)
        {
            return await _dbSet.Where(e => e.CategoryId == categoryId).ToListAsync();
        }
        public async Task<IEnumerable<T>> GetByCategoryWithPaginationAsync(int pageIndex, int payload, int categoryId)
        {
            return await _dbSet.Where(e => e.CategoryId == categoryId).Skip((pageIndex - 1) * payload)
                               .Take(payload)
                               .ToListAsync();
        }
    }
}

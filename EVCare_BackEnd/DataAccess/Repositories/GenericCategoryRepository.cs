using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class GenericCategoryRepository<T> : IGenericCategoryRepository<T> where T : class, ICategory, IEntity
    {
        protected readonly EVCareDbContext _dbContext;
        protected readonly DbSet<T> _dbSet;
        public GenericCategoryRepository(EVCareDbContext dbContext, DbSet<T> dbSet)
        {
            _dbContext = dbContext;
            _dbSet = dbSet;
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

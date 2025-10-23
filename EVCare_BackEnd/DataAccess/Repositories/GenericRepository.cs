using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class, IEntity
    {
        protected readonly EVCareDbContext _dbContext;
        protected readonly DbSet<T> _dbSet;
        

        public GenericRepository(EVCareDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = _dbContext.Set<T>();
        }
        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }
        public async Task<T> GetByIdAsync(int id)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(e => e.Id == id);
            if (entity == null)
            {
                throw new Exception($"Entity with id = {id} is not found.");
            }
            else
            {
                return entity;
            }
        }
        public async Task<IEnumerable<T>> GetWithPaginationAsync(int payload, int payindex)
        {
            return await _dbSet.Skip((payindex - 1) * payload).Take(payload).ToListAsync();
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public virtual async Task<T> UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = _dbSet.FirstOrDefault(e => e.Id == id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new Exception($"Entity with id = {id} is not found.");
            }
        }
    }
}

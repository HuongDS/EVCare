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
    public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<Employee?> GetEmployeeByAccountId(int accountId)
        {
            var entity = await _dbSet.Include(e => e.Account).FirstOrDefaultAsync(e => e.AccountId == accountId);
            return entity;
        }
    }
}

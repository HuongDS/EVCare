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
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Customer?> GetCustomerByAccountId(int accountId)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.AccountId == accountId);
        }
    }
}

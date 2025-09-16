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
    public class AccountRepository : GenericRepository<Account>, IAccountRepository
    {
        public AccountRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Account?> GetAccountByEmail(string email)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(e => e.Email.Equals(email));
            return entity;
        }
        public async Task<Account?> GetAccountByPhoneAsync(string phone)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(e => e.Phone.Equals(phone));
            return entity;
        }
    }
}

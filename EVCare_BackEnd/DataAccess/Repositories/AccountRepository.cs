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

        public async Task<bool> CheckAccountIsBanned(int accountId)
        {
            var account = await _dbSet.FindAsync(accountId);
            return (account.Deleted_At != DateTime.MinValue);
        }

        public async Task DeleteAccount(int accountId)
        {
            //var vnTime = DateTime.UtcNow.AddHours(7);

            await _dbContext.Accounts.Where(x => x.Id == accountId)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.Deleted_At, p => DateTime.UtcNow));
        }

        public async Task<Account?> GetAccountByEmail(string email)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(e => e.Email.Equals(email));
            return entity;
        }
        public async Task<Account?> GetAccountByPhoneAsync(string phone)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(e => e.Phone.Equals(phone) && e.Deleted_At == DateTime.MinValue);
            return entity;
        }

        public async Task<Account?> GetAccountByTechId(int techId) {
            var employee = await _dbContext.Employees.FirstOrDefaultAsync(x=>x.TechnicianId == techId);
            if (employee == null) return null;
            var account =  await _dbSet.FirstOrDefaultAsync(a => a.Id == employee.AccountId);
            return account;
        }

        public async Task<IEnumerable<int>> GetAccountIdByTechnicianIds(IEnumerable<int> technicianIds)
        {
            var res = await _dbSet.Include(a => a.Employee).ThenInclude(e => e.Technician)
                .Where(t => technicianIds.Contains(t.Id)).Select(t => t.Id).ToListAsync();
            return res;
        }
    }
}

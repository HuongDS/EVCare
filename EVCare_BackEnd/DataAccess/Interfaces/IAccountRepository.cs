using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IAccountRepository : IGenericRepository<Account>
    {
        Task<Account?> GetAccountByEmail(string email);
        Task<Account?> GetAccountByPhoneAsync(string phone);
        Task<bool> CheckAccountIsBanned(int accountId);
        Task DeleteAccount(int accountId);
        Task<IEnumerable<int>> GetAccountIdByTechnicianIds(IEnumerable<int> technicianIds);
        //Task DeleteAccount(int accountId);
    }
}

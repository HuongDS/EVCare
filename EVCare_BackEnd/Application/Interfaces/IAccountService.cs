using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Accounts;

namespace Application.Interfaces
{
    public interface IAccountService
    {
        Task DeleteAccount(int accountId);
        public Task<AccountViewModel> GetAccountById(int accountId);
        Task<int> UnbannedAccount(int accountId);
        Task<AccountViewModel> UpdateAccountByAccountID(AccountUpdateDto data, int accountId);
        Task<AccountViewModel> UpdatePasswordByAccountId(int accountId, AccountUpdatePasswordDto data);
        Task<bool> VerifyPasswordByAcccountId(int accountId, string password);
    }
}

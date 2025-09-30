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
        public Task<AccountViewModel> GetAccountById(int accountId);    
    }
}

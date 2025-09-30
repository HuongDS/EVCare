using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Accounts;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        public AccountService(IAccountRepository accountRepository,IMapper mapper)
        {
            _accountRepository = accountRepository;
            _mapper = mapper;
        }
        public async Task<AccountViewModel> GetAccountById(int accountId)
        {
            var account = await _accountRepository.GetByIdAsync(accountId);
            if (account == null) {

                throw new Exception("Source not found");
            }
            var data = _mapper.Map<AccountViewModel>(account);
            return data;
        }
    }
}

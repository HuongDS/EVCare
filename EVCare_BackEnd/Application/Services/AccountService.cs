using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Application.Infrastructures;
using Application.Interfaces;
using Application.Parttern;
using AutoMapper;
using DataAccess.Dtos.Accounts;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IMapper _mapper;
        public AccountService(IAccountRepository accountRepository, IMapper mapper, IRefreshTokenRepository refreshTokenRepository)
        {
            _accountRepository = accountRepository;
            _mapper = mapper;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task DeleteAccount(int accountId)
        {
            await _refreshTokenRepository.RevokeAllAsyncByAccountId(accountId);
            await _accountRepository.DeleteAccount(accountId);
        }

        public async Task<AccountViewModel> GetAccountById(int accountId)
        {
            var account = await _accountRepository.GetByIdAsync(accountId);
            if (account == null)
            {

                throw new Exception(Message.ACCOUNT_NOT_FOUND);
            }
            if (account.Deleted_At != DateTime.MinValue)
            {
                throw new Exception(Message.ACCOUNT_HAS_BEEN_DISABLED);
            }
            var data = _mapper.Map<AccountViewModel>(account);
            return data;
        }

        public async Task<int> UnbannedAccount(int accountId) {
            var account = await  _accountRepository.GetByIdAsync(accountId);
            if (account == null)
            {
                throw new Exception(Message.ACCOUNT_NOT_FOUND);
            }
            account.Deleted_At = DateTime.MinValue;
            await _accountRepository.UpdateAsync(account);
            return account.Id;
        }

        public async Task<AccountViewModel> UpdateAccountByAccountID(AccountUpdateDto data, int accountId)
        {
            var account = await _accountRepository.GetByIdAsync(accountId);
            if (account is null)
            {
                throw new Exception(Message.ACCOUNT_NOT_FOUND);
            }
            if (account.Deleted_At != DateTime.MinValue)
            {
                throw new Exception(Message.ACCOUNT_HAS_BEEN_DISABLED);
            }
            if (data.firstName.Length == 0 || data.lastName.Length == 0)
            {
                throw new Exception(Message.THIS_FIELD_IS_REQUIRED);
            }
            if (!Regex.IsMatch(data.phone, RegexPartterns.PHONE_NUMBER_PATTERN))
            {
                throw new Exception(Message.INVALID_PHONE);
            }
            var checkAccountExist = await _accountRepository.GetAccountByPhoneAsync(data.phone);
            if (checkAccountExist != null)
            {
                throw new Exception(Message.PHONE_EXISTS);
            }
            account.First_Name = data.firstName;
            account.Last_Name = data.lastName;
            account.Phone = data.phone;
            await _accountRepository.UpdateAsync(account);
            var result = _mapper.Map<AccountViewModel>(account);
            return result;
        }

        public async Task<AccountViewModel> UpdatePasswordByAccountId(int accountId, AccountUpdatePasswordDto data)
        {
            var account = await _accountRepository.GetByIdAsync(accountId);
            if (account is null)
            {
                throw new Exception(Message.ACCOUNT_NOT_FOUND);
            }
            if (account.Deleted_At != DateTime.MinValue)
            {
                throw new Exception(Message.ACCOUNT_HAS_BEEN_DISABLED);
            }
            if (!Regex.IsMatch(data.newPassword, RegexPartterns.PASSWORD_PATTERN))
            {
                throw new Exception(Message.WEAK_PASSWORD);
            }
            account.Hash_Password = BCrypt.Net.BCrypt.HashPassword(data.newPassword);
            await _accountRepository.UpdateAsync(account);
            var result = _mapper.Map<AccountViewModel>(account);
            return result;
        }

        public async Task<bool> VerifyPasswordByAcccountId(int accountId, string password)
        {
            var account = await _accountRepository.GetByIdAsync(accountId);
            if (account is null)
            {
                throw new Exception(Message.ACCOUNT_NOT_FOUND);
            }
            return BCrypt.Net.BCrypt.Verify(password, account.Hash_Password);
        }
    }
}

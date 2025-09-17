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
    public class RefreshTokenRepository : GenericRepository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task RevokeByHashAsync(string hash)
        {
            var token = await _dbSet.FirstOrDefaultAsync(t => t.Token == hash);
            if (token != null)
            {
                token.IsRevoked = true;
                await _dbContext.SaveChangesAsync();
            }
        }
        public async Task RevokeAllAsyncByAccountId(int accountId)
        {
            var tokens = await _dbSet.Where(t => t.AccountId == accountId).ToListAsync();
            foreach (var token in tokens)
            {
                token.IsRevoked = true;
            }
        }
        public async Task<RefreshToken?> GetValidAsync(string hashToken)
        {
            var token = await _dbSet.Include(t => t.Account).FirstOrDefaultAsync(t => t.Token == hashToken && !t.IsRevoked && t.ExpiryDate > DateTime.UtcNow);
            return token;
        }
        public async Task<(RefreshToken, RefreshToken)> RotateAsync(RefreshToken oldToken, RefreshToken newToken)
        {
            oldToken.IsRevoked = true;
            await _dbContext.AddAsync(newToken);
            _dbContext.Update(oldToken);
            await _dbContext.SaveChangesAsync();
            return (oldToken, newToken);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>
    {
        Task<RefreshToken?> GetValidAsync(string hashToken);
        Task RevokeAllAsyncByAccountId(int accountId);
        Task RevokeByHashAsync(string hash);
        Task<(RefreshToken, RefreshToken)> RotateAsync(RefreshToken oldToken, RefreshToken newToken);
    }
}

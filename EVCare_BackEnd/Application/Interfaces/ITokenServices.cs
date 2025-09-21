using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;

namespace Application.Interfaces
{
    public interface ITokenServices
    {
        string GenerateAccessToken(Account account);
        string GenerateRefreshToken();
        //ClaimsPrincipal? GetClaimsPrincipalFromExpiredToken(string token);
        DateTime GetExpireDays();
        string HashToken(string token);
    }
}

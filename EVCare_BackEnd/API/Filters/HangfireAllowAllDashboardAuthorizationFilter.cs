using System.IdentityModel.Tokens.Jwt;
using Hangfire.Annotations;
using Hangfire.Dashboard;

namespace API.Filters
{
    public class HangfireAllowAllDashboardAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize([NotNull] DashboardContext context)
        {
            var httpContext = context.GetHttpContext();

            if (httpContext.Request.Host.Host.Contains("localhost"))
                return true;

  
            var authHeader = httpContext.Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return false;

            var token = authHeader.Substring("Bearer ".Length).Trim();

            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

  
                var roleClaim = jwt.Claims.FirstOrDefault(c =>
                    c.Type == "role" || c.Type == "roles" || c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role");

                return roleClaim != null && roleClaim.Value.Equals("Admin", StringComparison.OrdinalIgnoreCase);
            }
            catch
            {
                return false;
            }
        }
    }
}

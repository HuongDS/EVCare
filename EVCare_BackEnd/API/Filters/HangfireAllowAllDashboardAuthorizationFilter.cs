using System.IdentityModel.Tokens.Jwt;
using Hangfire.Annotations;
using Hangfire.Dashboard;

namespace API.Filters
{
    public class HangfireAllowAllDashboardAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize([NotNull] DashboardContext context)
        {
            return true;
        }
    }
}

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
            if (httpContext.Request.Host.Host.Contains("azurewebsites.net") ||
                httpContext.Request.Host.Host.Contains("localhost"))
                return true;

            return false;
        }
    }
}

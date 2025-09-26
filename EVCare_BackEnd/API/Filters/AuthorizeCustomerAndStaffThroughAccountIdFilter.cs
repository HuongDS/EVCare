using DataAccess.Entities;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class AuthorizeCustomerAndStaffThroughAccountIdFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var userId = int.Parse(context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var userRole = context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userRole == "Staff") { 
                await next(); 
            }
            else
            {
                var accountId = context.ActionArguments.ContainsKey("accountId") ? (int)context.ActionArguments["accountId"] : 0;
                if (userId != accountId)
                {
                    context.HttpContext.Response.StatusCode = 403;
                    await context.HttpContext.Response.WriteAsync("You are not authorized to access this resource.");
                    return;
                }
                await next();
            }
        }
    }
}

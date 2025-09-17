using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class AppointmentAuthorizationFilter : IAsyncActionFilter
    {

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var userRole = context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userRole == "Staff")
            {
                await next();
            }
            else
            {

            }
        }
    }
}

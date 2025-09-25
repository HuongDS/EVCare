using System.Globalization;
using System.Security.Claims;
using DataAccess;
using DataAccess.Interfaces;

namespace API.Middlewares
{
    public class BannedMiddleware
    {
        private readonly RequestDelegate _next;
        public BannedMiddleware(RequestDelegate next)
        {
            _next = next;
           
        }
        public async Task InvokeAsync(HttpContext context, IAccountRepository _accountRepository)
        {
            if (context.User?.Identity?.IsAuthenticated == true) {
                var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var banned = await _accountRepository.CheckAccountIsBanned(int.Parse(userId));
                if(banned == true)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    context.Response.ContentType = "application/json; charset=utf-8";
                    await context.Response.WriteAsJsonAsync(new
                    {
                        statusCode = 403,
                        message = "Your account has been banned."
                    }, cancellationToken: context.RequestAborted);
                    return;
                }
                
            
            }
            await _next(context);

           

            
        }
    }
}

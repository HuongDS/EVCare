using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class AuthorizeCustomerOrAdminFilter : IAsyncActionFilter
    {
        private readonly ICustomerRepository _customerRepository;
        public AuthorizeCustomerOrAdminFilter(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var userId = int.Parse(context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var userRole = context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userRole == "Staff")
            {
                await next();
            }
            else
            {
                var customer = await _customerRepository.GetCustomerByAccountId(userId);
                if (customer == null)
                {
                    context.HttpContext.Response.StatusCode = 403;
                    await context.HttpContext.Response.WriteAsync("You are not authorized to access this resource.");
                    return;
                }
                var currentCustomerId = context.ActionArguments.ContainsKey("customerId") ? (int)context.ActionArguments["customerId"] : 0;
                if (customer.Id != currentCustomerId)
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

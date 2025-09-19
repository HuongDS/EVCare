using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class SetCustomerIdFilter : IAsyncActionFilter
    {
        private readonly ICustomerRepository _customerRepository;
        public SetCustomerIdFilter(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var userId = int.Parse(context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var customer =  await _customerRepository.GetCustomerByAccountId(userId);
            context.HttpContext.Items["CustomerId"] = customer.Id;
            await next();
        }
    }
}

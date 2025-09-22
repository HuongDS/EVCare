using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class GetAccountIdFilter : IAsyncActionFilter
    {
        private readonly IEmployeeRepository _employeeRepository;

        public GetAccountIdFilter(IEmployeeRepository employeeRepository)
        {
            this._employeeRepository = employeeRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var accountID = int.Parse(context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var employee = await _employeeRepository.GetEmployeeByAccountId(accountID);
            context.HttpContext.Items["EmployeeId"] = employee.Id;
            await next();
        }
    }
}

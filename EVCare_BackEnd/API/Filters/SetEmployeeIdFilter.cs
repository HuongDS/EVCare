using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class SetEmployeeIdFilter : IAsyncActionFilter
    {
        private readonly IEmployeeRepository _employeeRepository;
        public SetEmployeeIdFilter(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var userId = int.Parse(context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var employee = await _employeeRepository.GetEmployeeByAccountId(userId);
            context.HttpContext.Items["EmployeeId"] = employee.Id;
            await next();
        }
    }
}

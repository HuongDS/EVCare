using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters {
    public class AuthorizeEmployeeIsAbsent : IAsyncActionFilter {
        private readonly IEmployeeRepository _employeeRepository;
        public AuthorizeEmployeeIsAbsent(IEmployeeRepository employeeRepository) {
             _employeeRepository = employeeRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next) {
            var employeeId = (int)context.HttpContext.Items["EmployeeId"];
            var employee = await _employeeRepository.GetByIdAsync(employeeId);
           if(employee.Status != DataAccess.Enums.EmployeeStatusEnum.OnLeave) {
                await next();
           }
           else {
                context.Result = new JsonResult(new
                {
                    message = "You are absent today so you don't have access this resource",
                    data = (object?)null
                })
                {
                    StatusCode = 403
                };
                return;
            }
        }
    }
}

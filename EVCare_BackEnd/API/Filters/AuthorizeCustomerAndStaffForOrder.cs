using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters {
    public class AuthorizeCustomerAndStaffForOrder : IAsyncActionFilter {
        private readonly IAppointmentRepository _appointmentRepository;
        public AuthorizeCustomerAndStaffForOrder(IAppointmentRepository appointmentRepository) {
            _appointmentRepository = appointmentRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next) {
            var userRole = context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userRole == "Staff" || userRole == "Technician") {
                await next();
            }
            else {
                var orderId = context.ActionArguments.ContainsKey("orderId") ? (int)context.ActionArguments["orderId"] : 0;
                var appointment = await _appointmentRepository.GetByOrderIdAsync(orderId);
                if( appointment == null) {
                    context.Result = new Microsoft.AspNetCore.Mvc.JsonResult(new {
                        statusCode = 404,
                        message = "Order not found",
                        data = (object?)null
                    });
                    return;
                }
                var customerId = (int)context.HttpContext.Items["CustomerId"];
                if (appointment.CustomerId == customerId) {
                    await next();
                }
                else {
                    context.Result = new Microsoft.AspNetCore.Mvc.JsonResult(new {
                        statusCode = 403,
                        message = "You are not authorized to access this order",
                        data = (object?)null
                    });
                    return;
                }

            }
        }
    }
}

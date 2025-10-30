using Application.Interfaces;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class AppointmentAuthorizationFilter : IAsyncActionFilter
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public AppointmentAuthorizationFilter(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next) {
            var userRole = context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userRole == "Staff" || userRole == "Admin" || userRole == "Technician") 
            {
                await next();
            }
            else
            {
                int customerId = (int)context.HttpContext.Items["CustomerId"];
                int appointmentId = (int)context.ActionArguments["appointmentId"];
                try {
                    var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
                    if (appointment == null || appointment.CustomerId != customerId) {
                        context.Result = new ObjectResult(new
                        {
                            statusCode = 403,
                            message = "You are not authorized to access this appointment"
                        });
                        return;
                    }
                    await next();

                }
                catch(Exception ex) {
                    context.Result = new ObjectResult(new
                    {
                        statusCode = 400,
                        message = ex.Message
                    });
                    return;
                }
               
            }
        }
    }
}

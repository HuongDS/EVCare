using Application.Dtos;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class AppointmentOwnershipFilter : IAsyncActionFilter
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public AppointmentOwnershipFilter(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            try
            {
                var appointmentId = context.ActionArguments.ContainsKey("appointmentId") ? (int)context.ActionArguments["appointmentId"] : 0;
                var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
               
                var customerId = (int)context.HttpContext.Items["CustomerId"];
                if (appointment.CustomerId != customerId)
                {
                    context.Result = new JsonResult(new ResponseDto<object>
                    {
                        statusCode = 403,
                        message = "You are not authorized to access this appointment",
                        data = null
                    }
                        );
                    return;

                }
                await next();

            }
            catch (Exception ex)
            {
                context.Result = new NotFoundObjectResult(new ResponseDto<object>
                {
                    statusCode = 404,
                    message = "Appointment not found",
                    data = null
                }
                       );
                return;
            }
           
        }
    }
}

using DataAccess.Dtos.Review;
using DataAccess.Interfaces;
using DataAccess.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class CheckAuthorizationOfCustomerFilter : IAsyncActionFilter
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly ICustomerRepository _customerRepository;
        public CheckAuthorizationOfCustomerFilter(IAppointmentRepository appointmentRepository, ICustomerRepository customerRepository)
        {
            _appointmentRepository = appointmentRepository;
            _customerRepository = customerRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var model = context.ActionArguments.Values.OfType<ReviewCreateModel>().FirstOrDefault();
            var userId = int.Parse(context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var customer = await _customerRepository.GetCustomerByAccountId(userId);
            var appointment = await _appointmentRepository.GetByIdAsync(model.AppointmentId);
            if(appointment.CustomerId != customer.Id)
            {
                context.Result = new ObjectResult(new
                {
                    message = "You are not authorized to perform this action",
                    statusCode = 403
                });
                return;
            }
            await next();
        }
    }
}

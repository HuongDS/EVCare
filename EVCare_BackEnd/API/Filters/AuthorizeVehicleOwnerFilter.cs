using System.Security.Claims;
using DataAccess.Dtos.Vehicle;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class AuthorizeVehicleOwnerFilter : IAsyncActionFilter
    {
        private readonly IVehicleRepository _vehicleRepository;
        private readonly ICustomerRepository _customerRepository;
        public AuthorizeVehicleOwnerFilter(IVehicleRepository vehicleRepository,ICustomerRepository repository)
        {
            _vehicleRepository = vehicleRepository;
            _customerRepository = repository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
           var userId = int.Parse(context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (!context.ActionArguments.TryGetValue("model", out var modelObj) || modelObj is not VehicleCustomerUpdateModel model)
            {
                context.Result = new BadRequestObjectResult("Request body is missing or invalid.");
                return;
            }
            var vehicleId = model.Id;
            
            var customerId = await _vehicleRepository.GetCustomerIdByVehicleId(vehicleId);
            var currentCustomerId = await _customerRepository.GetCustomerByAccountId(userId);
            if (customerId != currentCustomerId.Id)
            {
                context.HttpContext.Response.StatusCode = 403;
                await context.HttpContext.Response.WriteAsync("You are not authorized to access this vehicle.");
                return;
            }
            context.HttpContext.Items["CustomerId"] = currentCustomerId.Id;
            await next();

        }
    }
}

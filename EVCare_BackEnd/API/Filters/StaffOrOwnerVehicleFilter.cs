using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class StaffOrOwnerVehicleFilter : IAsyncActionFilter
    {
        private readonly IVehicleRepository _vehicleRepository;
        public StaffOrOwnerVehicleFilter(IVehicleRepository vehicleRepository)
        {
            _vehicleRepository = vehicleRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var userRole = context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;   
            if(userRole=="Staff")
            {
                await next();
            }
            else
            {
                int customerId = (int)context.HttpContext.Items["CustomerId"];
                if (!context.ActionArguments.TryGetValue("vehicleId", out var vehicleIdObj) || vehicleIdObj is not int vehicleId)
                {
                    context.Result = new JsonResult(new
                    {
                        statusCode = 400,
                        message = "VehicleId parameter is missing or invalid"
                    });
                    return;
                }
                var vehicle = await _vehicleRepository.GetByIdAsync(vehicleId);
                if (vehicle == null || vehicle.CustomerId != customerId)
                {
                    context.Result = new ObjectResult(new
                    {
                        statusCode = 403,
                        message = "You are not authorized to access this vehicle"
                    });
                    return;
                }
                await next();
            }
        }
    }
}

using DataAccess.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class AuthorizeTechnicianDetail : IAsyncActionFilter
    {
        private readonly ITechnicianRepository _technicianRepository;
        public AuthorizeTechnicianDetail(ITechnicianRepository technicianRepository)
        {
            _technicianRepository = technicianRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {

            var Role = context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Role).Value;
            if (Role == "Admin" || Role =="Staff")
            {
                await next();
            }
            else
            {
                try
                {
                    int userId = int.Parse(context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
                    int technicianId = (int)context.ActionArguments["technicianId"];
                    var currentTechnicianId = await _technicianRepository.GetTechnicianIdByAccountId(userId);
                    if(currentTechnicianId != technicianId)
                    {
                        context.Result = new ObjectResult(new
                        {
                            message = "You are not authorized to access this resource." ,
                            statusCode = StatusCodes.Status403Forbidden
                        });

                    }
                    else
                    {
                        await next();
                    }
                }
                catch (Exception ex) {

                    context.Result = new BadRequestObjectResult(ex.Message);
                
                }
               

            }
        }
    }
}

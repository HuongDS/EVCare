using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class SetTechnicianIdFilter : IAsyncActionFilter
    {
        private readonly ITechnicianRepository _technicianRepositoty;
        public SetTechnicianIdFilter(ITechnicianRepository technicianRepositoty)
        {
            _technicianRepositoty = technicianRepositoty;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            try
            {
                var userId = int.Parse(context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
                int technicianId = await _technicianRepositoty.GetTechnicianIdByAccountId(userId);
                context.HttpContext.Items["TechnicianId"] = technicianId;
                await next();
            }
            catch (Exception ex)
            {
                context.Result = new JsonResult(new
                {
                    statusCode = 401,
                    message = ex.Message
                });
               
            }

            
        }
    }
}

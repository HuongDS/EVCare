using Application.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _service;
        public ServiceController(IServiceService service)
        {
            _service = service;
        }
        //admin
        [Authorize(Roles = "Admin")]
        [HttpGet()]
        public async Task<IActionResult> GetAllServices(string keyword,int? payload,int? pageindex)
        {
            if (keyword == null) {
                keyword = "";
            
            }
            if(payload.HasValue && pageindex.HasValue)
            {
                var services = await _service.GetServicesWithPaginationAsync(keyword,payload.Value, pageindex.Value);
                return Ok(new
                {
                    statusCode = 200,
                    message = "Successfully",
                    data = services
                });

            }
            else
            {
                var services = await _service.GetAllServicesAsync();
                return Ok(new
                {
                    statusCode = 200,
                    message = "Successfully",
                    data = services
                });

            }
               
        }
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveServices(string? keyword,int? payload, int? pageindex)
        {
            if (keyword == null) keyword = "";
            if (payload.HasValue && pageindex.HasValue)
            {
                var services = await _service.GetActiveServicesWithPaginationAsync(keyword,payload.Value, pageindex.Value);
                return Ok(new { statusCode = 200, message = "Successfully", data = services });
            }
            else
            {
                var services = await _service.GetAllActiveServicesAsync(keyword);
                return Ok(new { statusCode = 200, message = "Successfully", data = services });
            }
        }
    }
}

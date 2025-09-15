using Application.IService;
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
        [HttpGet()]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _service.GetAllServicesAsync();
            return Ok(new
            {
                statusCode = 200,
                message = "Successfully",
                data = services
            });
        }
        //admin
        [HttpGet("pagination")]
        public async Task<IActionResult> GetServicesWithPagination(int payload, int pageindex)
        {
            var services = await _service.GetServicesWithPaginationAsync(payload, pageindex);
            return Ok(new
            {
                statusCode = 200,
                message = "Successfully",
                data = services
            });
        }

        
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveServicesWithPagination(int payload,int pageindex)
        {
            var services = await _service.GetActiveServicesWithPaginationAsync(payload,pageindex);
            return Ok(new
            {
                statusCode = 200,
                message = "Successfully",
                data = services
            });
            
        }
    }
}

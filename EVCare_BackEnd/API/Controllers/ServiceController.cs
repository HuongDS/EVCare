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
    }
}

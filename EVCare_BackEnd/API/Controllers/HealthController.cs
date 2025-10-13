using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "healthy",
                time = DateTime.UtcNow.AddHours(7).ToString("yyyy-MM-dd HH:mm:ss"),
                message = "EVCare backend is alive 🚀"
            });
        }
    }
}

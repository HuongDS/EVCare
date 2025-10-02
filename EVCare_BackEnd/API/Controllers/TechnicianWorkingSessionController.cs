using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TechnicianWorkingSessionController : ControllerBase
    {
        private readonly ITechnicianWorkingSessionService _service;
        public TechnicianWorkingSessionController(ITechnicianWorkingSessionService service)
        {
            _service = service; 
        }
        [HttpPut("my-working-session/{orderId}")]
        public Task<IActionResult> UpdateWorkingSession(int orderId)
        {
            return null;
        }
    }
}

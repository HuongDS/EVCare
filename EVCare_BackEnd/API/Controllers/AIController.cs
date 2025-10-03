using Application.Interfaces;
using DataAccess.Dtos.AI;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly IReplenishmentPlanner _replenishmentPlanner;
        public AIController(IReplenishmentPlanner replenishmentPlanner)
        {
            _replenishmentPlanner = replenishmentPlanner;
        }

        [HttpGet("replenishment-gemini")]
        public async Task<IActionResult> Get(AIQueryDto model)
        {
            return null;
        }
    }
}

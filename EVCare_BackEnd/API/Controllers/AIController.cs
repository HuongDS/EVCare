using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.AI;
using DataAccess.Dtos.Pagination;
using Microsoft.AspNetCore.Authorization;
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
        //[Authorize(Roles ="Admin")]
        public async Task<IActionResult> Get([FromQuery]AIQueryDto model)
        {
            try
            {
                var data = await _replenishmentPlanner.SuggestAsync(model);
                return Ok(new ResponseDto<PageResultDto<ReplenishmentItem>>
                {
                    data = data,
                    message = Message.GET_AI_SUCCESSFULLY,
                    statusCode = HttpStatus.OK
                });

            }catch(Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }
    }
}

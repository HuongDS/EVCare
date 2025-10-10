using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using Application.Services;
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
        private readonly IAdminDashboardServices _adminDashboardServices;
        private readonly IAiInsightServices _aiInsightServices;

        public AIController(IReplenishmentPlanner replenishmentPlanner,
            IAdminDashboardServices adminDashboardServices,
            IAiInsightServices aiInsightServices)
        {
            _replenishmentPlanner = replenishmentPlanner;
            _adminDashboardServices = adminDashboardServices;
            _aiInsightServices = aiInsightServices;
        }

        [HttpGet("replenishment-gemini")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Get([FromQuery] AIQueryDto model)
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

            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }

        [HttpGet("summary")]
        public async Task<IActionResult> Summary()
        {
            return Ok(await _adminDashboardServices.GetSummaryAsync());
        }

        [HttpGet("performance")]
        public async Task<IActionResult> Performance([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var now = DateTime.Now;
            var fromDate = from ?? now.AddDays(-6);
            var toDate = to ?? now;
            return Ok(await _adminDashboardServices.GetSummaryCachedAsync(fromDate, toDate));
        }

        [HttpGet("insights")]
        public async Task<IActionResult> Insights([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            return Ok(await _aiInsightServices.GenerateInsightAsync(from, to));
        }

        [HttpGet("predict-revenue")]
        public async Task<IActionResult> PredictRevenue([FromQuery] DateTime from, [FromQuery] int nextDays = 7)
        {
            return Ok(await _aiInsightServices.PredictRevenueAsync(from, nextDays));
        }
    }
}

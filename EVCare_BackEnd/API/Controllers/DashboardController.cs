using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Dtos.PartHistory;
using DataAccess.Dtos.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase {
        private readonly IDashboardService _dashboardService;
        public DashboardController(IDashboardService dashboardService) {
            _dashboardService = dashboardService;
        }
        [HttpGet("top-services")]
        public async Task<IActionResult> GetDashboardSummary([FromQuery]ServiceSummaryQueryDto model) {
            try {
                var summary = await _dashboardService.GetDashboardSummaryAsync(model);
                return Ok(new ResponseDto<IEnumerable<ServiceSummaryViewModel>> {
                    statusCode = HttpStatus.OK,
                    message = Message.DASHBOARD_SUMMARY_GET_SERVICE_SUCCESSFULLY,
                    data = summary
                });
            }
            catch (Exception ex) {
                return BadRequest(new {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }
        [HttpGet("top-parts")]
        public async Task<IActionResult> GetTopUsedParts([FromQuery]PartSummaryQueryDto model) {
            try {
                var topParts = await _dashboardService.GetTopUsedPartsAsync(model);
                return Ok(new ResponseDto<IEnumerable<PartSummaryViewModel>> {
                    statusCode = HttpStatus.OK,
                    message = Message.DASHBOARD_SUMMARY_GET_PART_SUCCESSFULLY,
                    data = topParts
                });
            }
            catch (Exception ex) {
                return BadRequest(new {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }

        [HttpGet("part-histories")]
        public async Task<IActionResult> GetPartUsageHistories([FromQuery] PartHistoryQueryDto model) {
            try {
                var partHistories = await _dashboardService.GetPartUsageHistoriesAsync(model);
                return Ok(new ResponseDto<PageResultDto<PartHistoryViewModel>> {
                    statusCode = HttpStatus.OK,
                    message = Message.DASHBOARD_PART_HISTORY_GET_SUCCESSFULLY,
                    data = partHistories
                });
            }
            catch (Exception ex) {
                return BadRequest(new {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }
    }
}

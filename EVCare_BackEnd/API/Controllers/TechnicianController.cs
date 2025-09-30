using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Technician;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TechnicianController : ControllerBase
    {
        private readonly ITechnicianService _technicianService;
        public TechnicianController(ITechnicianService technicianService)
        {
            _technicianService = technicianService;
        }
        [HttpGet("get-technician-today")]
        [Authorize(Roles ="Staff")]
        public async Task<IActionResult> GetTechnicianToday([FromQuery] TechnicianQueryDto model)
        {
            try
            {
                var data = await _technicianService.GetTechnicianToday(model);
                return Ok(new ResponseDto<PageResultDto<TechnicianViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.GET_TECHNICIAN_SUCCESSFULLY,
                    data = data
                });

            }
            catch (Exception ex)
            {
                {
                    return BadRequest(new ResponseDto<object>
                    {
                        statusCode = HttpStatus.BAD_REQUEST,
                        message = ex.Message,
                        data = null

                    });
                }

            }
        }
    }
}

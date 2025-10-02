using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Technician;
using Microsoft.AspNetCore.Authorization;
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
        [HttpPut("my-working-session")]
        [Authorize(Roles ="Technician")]
        [ServiceFilter(typeof(SetTechnicianIdFilter))]
        public async Task<IActionResult> UpdateWorkingSession(TechnicianWorkingSessionUpdateModel model)
        {
            try
            {
                var techicianId = (int)HttpContext.Items["TechnicianId"];
                await _service.UpdateWorkingSession(techicianId, model);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.UPDATE_SUCCESSFULLY,
                    data = model.OrderId
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

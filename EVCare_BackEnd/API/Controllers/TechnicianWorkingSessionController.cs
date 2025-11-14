using API.Filters;
using Application.DomainEvents;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using Azure;
using DataAccess.Dtos.OrderParts;
using DataAccess.Dtos.Technician;
using DataAccess.Enums;
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
        private readonly OnStatusOrderChange _onStatusOrderChange;

        public TechnicianWorkingSessionController(ITechnicianWorkingSessionService service,
            OnStatusOrderChange onStatusOrderChange)
        {
            _service = service;
            _onStatusOrderChange = onStatusOrderChange;
        }
        [HttpPut("my-working-session")]
        [Authorize(Roles = "Technician")]
        [ServiceFilter(typeof(SetTechnicianIdFilter))]
        public async Task<IActionResult> UpdateWorkingSession(TechnicianWorkingSessionUpdateModel model)
        {
            try
            {
                var techicianId = (int)HttpContext.Items["TechnicianId"];
                await _service.UpdateWorkingSession(techicianId, model);
                if (model.Status == DataAccess.Enums.TechnicianWorkingSessionEnum.Completed)
                {
                    await _onStatusOrderChange.HandleAsync<object>(OrderStatusChangeEventEnum.TechnicianDoneTask, null, null);
                }
                else if (model.Status == DataAccess.Enums.TechnicianWorkingSessionEnum.Confirm)
                {
                    await _onStatusOrderChange.HandleAsync<OrderPartsViewDto>(OrderStatusChangeEventEnum.OrderConfirmed, null, null);
                }
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.UPDATE_SUCCESSFULLY,
                    data = model.OrderId
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

        [HttpPut("technician-status")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<IActionResult> UpdateTechnicianStatusInOrder([FromQuery] List<int> technicianId, [FromQuery] int orderId)
        {
            try
            {
                await _service.UpdateStatusTechnicinInOrder(technicianId, orderId);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.NO_CONTENT,
                    message = Message.DELETE_SUCCESSFULLY,
                    data = orderId
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
    }
}

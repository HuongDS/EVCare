using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Dtos.Technician;
using DataAccess.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TechnicianController : ControllerBase {
        private readonly ITechnicianService _technicianService;
        public TechnicianController(ITechnicianService technicianService) {
            _technicianService = technicianService;
        }
        [HttpGet("get-technician-today")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> GetTechnicianToday([FromQuery] TechnicianQueryDto model) {
            try {
                var data = await _technicianService.GetTechnicianToday(model);
                return Ok(new ResponseDto<PageResultDto<TechnicianViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.GET_TECHNICIAN_SUCCESSFULLY,
                    data = data
                });

            }
            catch (Exception ex) {
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

        [HttpGet("detail/{technicianId}")]
        [Authorize(Roles = "Staff,Admin,Technician")]
        //[ServiceFilter(typeof(AuthorizeTechnicianDetail))]
        public async Task<IActionResult> GetTechnicianDeatil(int technicianId) {
            try {
                var data = await _technicianService.GetTechnicianDetail(technicianId);
                return Ok(new ResponseDto<TechnicianViewModel>
                {
                    data = data,
                    statusCode = HttpStatus.OK,
                    message = Message.GET_TECHNICIAN_SUCCESSFULLY

                });

            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });

            }
        }

        [HttpGet("technicians-by-orderId/{orderId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetTechniciansByOrderId(int orderId) {
            try {
                var data = await _technicianService.GetTechniciansByOrderId(orderId);
                return Ok(new ResponseDto<IEnumerable<TechnicianCusViewModel>>
                {
                    data = data,
                    statusCode = HttpStatus.OK,
                    message = Message.GET_TECHNICIAN_SUCCESSFULLY
                });
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }

        [HttpGet("status")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetTechnicianStatus(EmployeeStatusEnum? status) {
            try {
                var data = await _technicianService.GetTechnicianStatus(status);
                return Ok(new ResponseDto<int>
                {
                    data = data,
                    statusCode = HttpStatus.OK,
                    message = Message.GET_TECHNICIAN_SUCCESSFULLY
                });
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }

        [HttpPut()]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTechnicianProfile([FromQuery] int technicianId, [FromBody] TechnicianUpdateModel model) {
            try {

                await _technicianService.UpdateTechnicianProfile(technicianId, model);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.UPDATE_SUCCESSFULLY,
                    data = technicianId
                });
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }

        [HttpGet("parts/pending")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> GetTechnicianPendingParts([FromQuery] TechnicianPendingPartModel query) {
            try {
                var data = await _technicianService.GetTechnicianPendingParts(query);
                return Ok(new ResponseDto<IEnumerable<PartTechnicianViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.GET_TECHNICIAN_SUCCESSFULLY,
                    data = data
                });
            }
            catch (Exception ex) {
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

        [HttpGet("technician-repaired-parts")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<IActionResult> GetTechnicianRepairedParts([FromQuery] TechnicianPartQueryDto query) {
            try {
                var data = await _technicianService.GetTechnicianRepairedParts(query);
                return Ok(new ResponseDto<PageResultDto<TechnicianPartViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.GET_TECHNICIAN_SUCCESSFULLY,
                    data = data
                });
            }
            catch (Exception ex) {
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

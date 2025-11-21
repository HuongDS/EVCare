using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.AppointmentPartCondition;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentPartConditionController : ControllerBase {
       private readonly IAppointmentPartConditionService _appointmentPartConditionService;
         public AppointmentPartConditionController(IAppointmentPartConditionService appointmentPartConditionService) {
              _appointmentPartConditionService = appointmentPartConditionService;
        }

        [HttpGet]
        [Authorize(Roles="Technician")]
        [ServiceFilter(typeof(SetTechnicianIdFilter))]
        public async Task<IActionResult> GetAppointmentPartConditions([FromQuery] int appointmentId) {
            try {
                var technicianId = (int)HttpContext.Items["TechnicianId"];
                var result = await _appointmentPartConditionService.GetAppointmentPartConditionsAsync(appointmentId, technicianId);
                return Ok(new ResponseDto<AppointmentPartConditionViewModel>
                {
                    statusCode = HttpStatus.OK,
                    message = "Appointment part conditions retrieved successfully",
                    data = result
                });
            } catch (Exception e) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = e.Message,
                   
                });
            }
        }

        [HttpPut("appointment-part-condtition-status")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> UpdateAppointmentPartConditionStatus([FromQuery]int technicianId,[FromQuery]int appointmentId) {
            try {
                await _appointmentPartConditionService.UpdateAppointmentPartConditionStatusAsync(technicianId, appointmentId);
                return Ok(new {
                    statusCode = HttpStatus.OK,
                    message = "Appointment part condition status updated successfully",
                   
                });
            } catch (Exception e) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = e.Message,
                   
                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Technician")]
        [ServiceFilter(typeof(SetTechnicianIdFilter))]

        public async Task<IActionResult> CreateAppointmentPartCondition([FromBody] AppointmentPartConditionCreateModel dto) {
            try {
                var technicianId = (int)HttpContext.Items["TechnicianId"];
                await _appointmentPartConditionService.CreateAppointmentPartConditionAsync(dto,technicianId);
                return Ok(new {
                    statusCode = HttpStatus.CREATED,
                    message = "Appointment part condition created successfully",
                   
                });
            } catch (Exception e) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = e.Message,
                   
                });
            }
        }

        [HttpPut]
        [Authorize(Roles = "Technician")]
        [ServiceFilter(typeof(SetTechnicianIdFilter))]
        public async Task<IActionResult> UpdateAppointmentPartCondition([FromBody] AppointmentPartConditionCreateModel dto) {
            try {
                var technicianId = (int)HttpContext.Items["TechnicianId"];
                await _appointmentPartConditionService.UpdateAppointmentPartConditionAsync(dto, technicianId);
                return Ok(new {
                    statusCode = HttpStatus.OK,
                    message = "Appointment part condition updated successfully",
                });
            } catch (Exception e) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = e.Message,

                });
            }
        }
    }
}

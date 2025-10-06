using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Appointment;
using DataAccess.Dtos.Others;
using DataAccess.Dtos.Technician;
using DataAccess.Dtos.Technicians;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeServices _employeeServices;
        private readonly IAppointmentService _appointmentService;
        private readonly ITechnicianWorkingSessionService _technicianWorkingSessionService;

        public EmployeeController(
            IEmployeeServices employeeServices,
            IAppointmentService appointmentService,
            ITechnicianWorkingSessionService technicianWorkingSessionService)
        {
            this._employeeServices = employeeServices;
            this._appointmentService = appointmentService;
            _technicianWorkingSessionService = technicianWorkingSessionService;
        }
        [HttpGet("check-slots")]
        public async Task<IActionResult> CheckSlotsAsync()
        {
            var (resultUsedSlots, resultTotalSlots) = await _employeeServices.CheckSlotsAsync();
            return Ok(new ResponseDto<TrackingSlotsDto>
            {
                statusCode = HttpStatus.OK,
                message = Message.CHECK_SLOT_SUCCESS,
                data = new TrackingSlotsDto
                {
                    usedSlots = resultUsedSlots,
                    totalSlots = resultTotalSlots
                }
            });
        }
        [HttpPost("assign-technician")]
        public async Task<IActionResult> AssignTechnicianToOrder(AssignTechnicianDto data)
        {
            var (usedSlots, totalSlots) = await _employeeServices.CheckSlotsAsync();
            if (usedSlots >= totalSlots)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = Message.SLOT_FULL,
                    data = null
                });
            }
            await _employeeServices.AssignOrderToTechnicianAsync(data);
            return Ok(new ResponseDto<object>
            {
                statusCode = HttpStatus.OK,
                message = Message.ASSIGNED_TECHNICIAN_SUCCESSFUL,
                data = null
            });
        }

        [HttpPost("assign-technicians")]

        public async Task<IActionResult> AssignTechniciansToOrder(AssignTechniciansModel model)
        {
            try
            {
                //var (usedSlots, totalSlots) = await _employeeServices.CheckSlotsAsync();
                //if (usedSlots >= totalSlots)
                //{
                //    return BadRequest(new ResponseDto<object>
                //    {
                //        statusCode = HttpStatus.BAD_REQUEST,
                //        message = Message.SLOT_FULL,
                //        data = null
                //    });
                //}

                await _technicianWorkingSessionService.AddTechnicianToOrder(model);
                return Ok(new ResponseDto<object>
                        {
                            statusCode = HttpStatus.CREATED,
                            message = Message.ADD_TECHNICIAN_SUCCESSFULLY,
                        }
                );



            }
            catch (Exception ex)
            {

                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }
        [HttpPost("update-appointment-date")]
        public async Task<IActionResult> UpdateAppointmentDate(AppointmentUpdateDateDto data)
        {
            try
            {
                var res = await _appointmentService.UpdateAppointmentDateAsync(data.newDate, data.appointmentId);
                return Ok(new ResponseDto<object>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.APPOINTMENT_UPDATED_SUCCESS,
                    data = null
                });
            }
            catch (Exception ex)
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

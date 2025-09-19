using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Appointment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateAppointment(AppointmentCreateModel model)
        {
            try
            {
                var appointmentId = await _appointmentService.CreateAppointment(model);
                return Ok(new
                {
                    StatusCode = HttpStatus.OK,
                    Message = Message.APPOINTMENT_CREATED_SUCCESS,
                    AppointmentId = appointmentId
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = HttpStatus.BAD_REQUEST,
                    message = Message.SOMETHING_WENT_WRONG,
                });
            }
        }
        [HttpPost("/update-appointment-status")]
        [Authorize(Roles = "Staff, Technician")]
        public async Task<IActionResult> UpdateAppointmentStatus(AppointmentUpdateDto data)
        {
            try
            {
                var appointmentID = await _appointmentService.UpdateAppointmentStatus(data);
                return Ok(new
                {
                    StatusCode = HttpStatus.OK,
                    Message = Message.APPOINTMENT_STATUS_UPDATED_SUCCESS,
                    AppointmentId = appointmentID
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }
        [HttpPost("/get-appointments-indate-employee")]
        [Authorize(Roles = "Staff, Technician")]
        public async Task<IActionResult> GetAppointmentByEmployeeIDAsync(AppointmentGetByEmployeeDto data)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentByEmployeeIDAsync(data.employeeID, data.status, data.currentDate, data.pageSize, data.pageIndex);
                return Ok(new
                {
                    StatusCode = HttpStatus.OK,
                    Message = Message.APPOINTMENTS_FETCHED_SUCCESS,
                    Data = appointments
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }
        [HttpPost("/get-all-appointments")]
        [Authorize(Roles = "Staff, Technician")]
        public async Task<IActionResult> GetAllAppointmentByEmployeeIDAsync(AppointmentGetAllByEmployeeDto data)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentByEmployeeIDAsync(data.employeeID, data.status, data.pageSize, data.pageIndex);
                return Ok(new
                {
                    StatusCode = HttpStatus.OK,
                    Message = Message.APPOINTMENTS_FETCHED_SUCCESS,
                    Data = appointments
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }
    }
}

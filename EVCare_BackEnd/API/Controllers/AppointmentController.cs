using API.Filters;
using Application.Dtos;
using Application.Interfaces;
using DataAccess.Dtos.Appointment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;   
        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }
        [Authorize(Roles = "Staff")]
        [HttpPost("staff")]
        public async Task<IActionResult> CreateAppointment(AppointmentCreateModel model)
        {
            try
            {
                var appointmentId = await _appointmentService.CreateAppointment(model);
                return Ok(new
                {
                    StatusCode = 200,
                    Message = "Appointment created successfully",
                    AppointmentId = appointmentId
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    message = "Something went wrong",
                });
            }
        }
        [HttpPost("customer")]
        [ServiceFilter(typeof(SetCustomerIdFilter))]
        public async Task<IActionResult> CreateAppointmentForCustomer(AppointmentCustomerCreateModel model)
        {
            try
            {


                var newModel = new AppointmentCreateModel
                {
                    CustomerId = (int)HttpContext.Items["CustomerId"],
                    Appointment_Date = model.Appointment_Date,
                    ImagesUrls = model.ImagesUrls,
                    Note = model.Note,
                    ServiceIds = model.ServiceIds,
                    VehicleId = model.VehicleId

                };
                var appointmentId = await _appointmentService.CreateAppointment(newModel);
                return Ok(new
                {
                    StatusCode = 200,
                    Message = "Appointment created successfully",
                    AppointmentId = appointmentId
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    message = "Something went wrong",
                });
            }
        }

        [Authorize(Roles = "Staff")]
        [HttpPut("staff")]
        [ServiceFilter(typeof(SetEmployeeIdFilter))]
        public async Task<IActionResult> UpdateAppointment(AppointmentUpdateModel model)
        {
            try
            {
                var employeeId = (int)HttpContext.Items["EmployeeId"];
                var result = await _appointmentService.UpdateAppointment(model,employeeId);
                return Ok(new ResponseDto<bool>
                {
                    statusCode = 200,
                    message = "Appointment updated successfully",
                    data = result
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });

            }
        }

        [HttpDelete("{appointmentId}")]
        [ServiceFilter(typeof(SetCustomerIdFilter))]
        [ServiceFilter(typeof(AppointmentOwnershipFilter))]
        public async Task<IActionResult> DeleteAppointment(int appointmentId)
        {
            try
            {
                var result = await _appointmentService.DeleteAppointment(appointmentId);
                return Ok(new ResponseDto<bool>
                {
                    statusCode = 200,
                    message = "Appointment canceled successfully",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }

        [HttpGet("{appointmentId}")]
        [ServiceFilter(typeof(SetCustomerIdFilter))]
        [ServiceFilter(typeof(AppointmentAuthorizationFilter))]
        public async Task<IActionResult> GetAppointmentDetailByAppointmetId(int appointmentId)
        {
            try
            {
                // This is a placeholder for actual implementation
                var appointment = await _appointmentService.GetAppointmentByiD(appointmentId);

                return Ok(new ResponseDto<AppointmentViewDetailModel>
                {
                    statusCode = 200,
                    message = "Appointments retrieved successfully",
                    data = appointment // Replace null with actual appointments data
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }



    }
}

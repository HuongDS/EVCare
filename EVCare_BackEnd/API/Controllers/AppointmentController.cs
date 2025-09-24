using Application.Infrastructures;
using API.Filters;
using Application.Dtos;
using Application.Interfaces;
using DataAccess.Dtos.Appointment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DataAccess.Dtos.CenterCare;

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
        [ServiceFilter(typeof(GetAccountIdFilter))]
        public async Task<IActionResult> GetAppointmentByEmployeeIDAsync(AppointmentGetByEmployeeFromEmployeeDto data)
        {
            try
            {
                var employeeId = (int)HttpContext.Items["EmployeeId"];
                var newReq = new AppointmentGetByEmployeeDto
                {
                    employeeID = employeeId,
                    status = data.status,
                    currentDate = data.currentDate,
                    pageSize = data.pageSize,
                    pageIndex = data.pageIndex
                };
                var appointments = await _appointmentService.GetAppointmentByEmployeeIDAsync(newReq.employeeID, newReq.status, newReq.currentDate, newReq.pageSize, newReq.pageIndex);
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
        public async Task<IActionResult> GetAllAppointmentByEmployeeIDAsync(AppointmentGetByEmployeeFromEmployeeDto data)
        {
            try
            {
                var employeeId = (int)HttpContext.Items["EmployeeId"];
                var newReq = new AppointmentGetByEmployeeDto
                {
                    employeeID = employeeId,
                    status = data.status,
                    pageSize = data.pageSize,
                    pageIndex = data.pageIndex
                };
                var appointments = await _appointmentService.GetAppointmentByEmployeeIDAsync(newReq.employeeID, newReq.status, newReq.pageSize, newReq.pageIndex);
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
                    message = ex.Message,
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
                var result = await _appointmentService.UpdateAppointment(model, employeeId);
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

        [HttpGet("history")]
        [ServiceFilter(typeof(SetCustomerIdFilter))]

        public async Task<IActionResult> GetAppointmentHistory()
        {
            try
            {
                int customerId = (int)HttpContext.Items["CustomerId"];

                var appointments = await _appointmentService.GetAppointmentHistoryByCustomerId(customerId);
                return Ok(new ResponseDto<IEnumerable<AppointmentViewModel>>
                {
                    statusCode = 200,
                    message = "Appointments retrieved successfully",
                    data = appointments
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,

                });
            }
        }

        [HttpGet("staff/history/{customerId}")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> GetAppointmentHistoryByCustomerId(int customerId)
        {
            try
            {

                var appointments = await _appointmentService.GetAppointmentHistoryByCustomerId(customerId);
                return Ok(new ResponseDto<IEnumerable<AppointmentViewModel>>
                {
                    statusCode = 200,
                    message = "Appointments retrieved successfully",
                    data = appointments
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                });
            }
        }
        [HttpGet("appointments/paged")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> GetAppointmentsWithPagination(int? payload, int? pageindex)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsWithPagination(payload, pageindex);
                return Ok(new ResponseDto<IEnumerable<AppointmentViewModel>>
                {
                    statusCode = 200,
                    message = "Appointments retrieved successfully",
                    data = appointments
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                });
            }
        }
        [HttpGet("/get-appointment-in-current-day")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> GetAppointmentInCurrentDay(int pageSize, int pageIndex)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentInCurrentDay(pageSize, pageIndex);
                return Ok(appointments);
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
        [HttpGet("/get-appointment-before-day")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> GetAppointmentBeforeDayAsync(DateTime date, int pageSize, int pageIndex)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentBeforeDayAsync(date, pageSize, pageIndex);
                return Ok(appointments);
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

        [HttpGet("daily-count")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDailyCounts()
        {
            try
            {
                var dates = await _appointmentService.GetAppointmentWithCountDaily();
                return Ok(new ResponseDto<CenterDailyCapacityModel>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.APPOINTMENT_GET_SUCCESS,
                    data = dates

                });

            }
            catch(Exception ex)
            {
                return BadRequest(new ResponseDto<Object>
                {
                    statusCode = 400,
                    message = ex.Message

                });

            }
        }



    }
}

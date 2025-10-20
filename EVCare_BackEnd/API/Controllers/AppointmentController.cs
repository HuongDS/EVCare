using Application.Infrastructures;
using API.Filters;
using Application.Dtos;
using Application.Interfaces;
using DataAccess.Dtos.Appointment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using DataAccess.Enums;
using Microsoft.AspNetCore.Http.HttpResults;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Application.Services;
using Newtonsoft.Json.Linq;
using DataAccess.Dtos.CenterCare;
using DataAccess.Dtos.Pagination;
using Application.DomainEvents;


namespace API.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly INotificationServices _notificationServices;
        private readonly ITokenServices _tokenServices;
        private readonly IAlertServices _alertServices;
        private readonly OnAppointmentConfirmHandler _onAppointmentConfirmHandler;

        public AppointmentController(IAppointmentService appointmentService, INotificationServices notificationServices,
            ITokenServices tokenServices, IAlertServices alertServices,
            OnAppointmentConfirmHandler onAppointmentConfirmHandler)
        {
            _appointmentService = appointmentService;
            _notificationServices = notificationServices;
            _tokenServices = tokenServices;
            _alertServices = alertServices;
            _onAppointmentConfirmHandler = onAppointmentConfirmHandler;
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
                    StatusCode = HttpStatus.CREATED,
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
        [HttpPost("update-appointment-status")]
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
        //[HttpPost("get-appointments-employee")]
        //[Authorize(Roles = "Staff, Technician")]
        //[ServiceFilter(typeof(GetAccountIdFilter))]
        //public async Task<IActionResult> GetAppointmentByEmployeeIDAsync(AppointmentGetByEmployeeFromEmployeeDto data)
        //{
        //    try
        //    {
        //        var employeeId = (int)HttpContext.Items["EmployeeId"];
        //        var newReq = new AppointmentGetByEmployeeDto
        //        {
        //            employeeID = employeeId,
        //            status = data.status,
        //            currentDate = data.currentDate,
        //            pageSize = data.pageSize,
        //            pageIndex = data.pageIndex
        //        };
        //        var appointments = await _appointmentService.GetAppointmentByEmployeeIDAsync(newReq.employeeID, newReq.status, newReq.currentDate, newReq.pageSize, newReq.pageIndex);
        //        return Ok(new
        //        {
        //            StatusCode = HttpStatus.OK,
        //            Message = Message.APPOINTMENTS_FETCHED_SUCCESS,
        //            Data = appointments
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new
        //        {
        //            StatusCode = HttpStatus.BAD_REQUEST,
        //            message = ex.Message,
        //        });
        //    }
        //}
        //[HttpPost("get-all-appointments")]
        //[Authorize(Roles = "Staff, Technician")]
        //public async Task<IActionResult> GetAllAppointmentByEmployeeIDAsync(AppointmentGetByEmployeeFromEmployeeDto data)
        //{
        //    try
        //    {
        //        var employeeId = (int)HttpContext.Items["EmployeeId"];
        //        var newReq = new AppointmentGetByEmployeeDto
        //        {
        //            employeeID = employeeId,
        //            status = data.status,
        //            pageSize = data.pageSize,
        //            pageIndex = data.pageIndex
        //        };
        //        var appointments = await _appointmentService.GetAppointmentByEmployeeIDAsync(newReq.employeeID, newReq.status, newReq.pageSize, newReq.pageIndex);
        //        return Ok(new
        //        {
        //            StatusCode = HttpStatus.OK,
        //            Message = Message.APPOINTMENTS_FETCHED_SUCCESS,
        //            Data = appointments
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new
        //        {
        //            StatusCode = HttpStatus.BAD_REQUEST,
        //            message = ex.Message,
        //        });
        //    }
        //}

        [HttpPost("customer")]
        [Authorize(Roles = "Customer")]
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
                var appointmentDetails = await _appointmentService.GetAppointmentByiD(appointmentId);
                await _notificationServices.SendAppointmentInforAsync(appointmentDetails);
                return Ok(new
                {
                    StatusCode = HttpStatus.CREATED,
                    Message = Message.APPOINTMENT_CREATED_SUCCESS,
                    AppointmentId = appointmentId
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
                    statusCode = HttpStatus.OK,
                    message = Message.APPOINTMENT_UPDATED_SUCCESS,
                    data = result
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

        [Authorize(Roles = "Staff")]
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
                    statusCode = HttpStatus.OK,
                    message = Message.APPOINTMENT_CANCEL_SUCCESS,
                    data = result
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

        [Authorize]
        [HttpGet("{appointmentId}")]
        [ServiceFilter(typeof(SetCustomerIdFilter))]
        [ServiceFilter(typeof(AppointmentAuthorizationFilter))]
        public async Task<IActionResult> GetAppointmentDetailByAppointmetId(int appointmentId)
        {
            try
            {

                var appointment = await _appointmentService.GetAppointmentByiD(appointmentId);

                return Ok(new ResponseDto<AppointmentViewDetailModel>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.APPOINTMENT_GET_SUCCESS,
                    data = appointment
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

        [Authorize]
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
                    statusCode = HttpStatus.OK,
                    message = Message.APPOINTMENT_GET_SUCCESS,
                    data = appointments
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

        [HttpGet("staff/history/{customerId}")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> GetAppointmentHistoryByCustomerId(int customerId)
        {
            try
            {

                var appointments = await _appointmentService.GetAppointmentHistoryByCustomerId(customerId);
                return Ok(new ResponseDto<IEnumerable<AppointmentViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.APPOINTMENT_GET_SUCCESS,
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
        public async Task<IActionResult> GetAppointmentsWithPagination([FromQuery] AppointmentQueryDto model)
        {
            try
            {

                var appointments = await _appointmentService.GetAppointmentsWithPagination(model);
                return Ok(new ResponseDto<PageResultDto<AppointmentViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.APPOINTMENT_GET_SUCCESS,
                    data = appointments
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
        [HttpGet("customer-confirm-appointment")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateConfirmAppointmentDateAsync([FromQuery] string token)
        {
            var payload = _tokenServices.Validate(token);
            if (!payload.Item1 || payload.Item4 != "confirm")
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = Message.INVALID_TOKEN,
                    data = null
                });
            }

            var appointmentId = payload.Item3;
            var appointment = await _appointmentService.GetAppointmentByiD(appointmentId);
            if (appointment == null)
            {
                return NotFound(new ResponseDto<object>
                {
                    statusCode = HttpStatus.NOT_FOUND,
                    message = Message.APPOINTMENT_NOT_FOUND,
                    data = null
                });
            }
            if (appointment.Status != AppointmentStatusEnum.Pending)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = Message.APPOINTMENT_CANNOT_BE_CONFIRMED,
                    data = null
                });
            }
            var res = await _appointmentService.UpdateAppointmentStatus(new AppointmentUpdateDto
            {
                appointmentID = appointmentId,
                status = AppointmentStatusEnum.Confirmed
            });
            await _onAppointmentConfirmHandler.HandleAsync();
            await _alertServices.AddConfirmAlertAsync(new DataAccess.Dtos.Alerts.AlertCreateDto
            {
                appointmentId = appointmentId,
                message = $"New appointment on {appointment.AppointmentDate.ToString("dd/mm/yyyy")} has been confirmed."
            });
            return Ok(res);
        }

        [HttpGet("customer-cancel-appointment")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateCancelAppointmentDateAsync([FromQuery] string token)
        {
            var payload = _tokenServices.Validate(token);
            if (!payload.Item1 || payload.Item4 != "cancel")
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = Message.INVALID_TOKEN,
                    data = null
                });
            }

            var appointmentId = payload.Item3;
            var appointment = await _appointmentService.GetAppointmentByiD(appointmentId);
            if (appointment == null)
            {
                return NotFound(new ResponseDto<object>
                {
                    statusCode = HttpStatus.NOT_FOUND,
                    message = Message.APPOINTMENT_NOT_FOUND,
                    data = null
                });
            }
            if (appointment.Status != AppointmentStatusEnum.Pending)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = Message.APPOINTMENT_CANNOT_BE_CANCELED,
                    data = null
                });
            }
            var res = await _appointmentService.UpdateAppointmentStatus(new AppointmentUpdateDto
            {
                appointmentID = appointmentId,
                status = AppointmentStatusEnum.Canceled
            });
            await _onAppointmentConfirmHandler.HandleAsync();
            await _alertServices.AddConfirmAlertAsync(new DataAccess.Dtos.Alerts.AlertCreateDto
            {
                appointmentId = appointmentId,
                message = $"New appointment on {appointment.AppointmentDate.ToString("dd/mm/yyyy")} has been canceled."
            });
            return Ok(res);
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

        [HttpGet("get-appointment-technician")]
        [Authorize(Roles = "Technician")]
        [ServiceFilter(typeof(SetTechnicianIdFilter))]
        public async Task<IActionResult> GetAppointmentByTechnician([FromQuery] AppointmentTechnicianQueryDto model)
        {
            try
            {
                var technicianId = (int)HttpContext.Items["TechnicianId"];
                var data = await _appointmentService.GetAppointmentByTechnicianId(technicianId, model);
                return Ok(new ResponseDto<PageResultDto<AppointmentTechnicianViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.APPOINTMENT_GET_SUCCESS,
                    data = data
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    message = ex.Message,
                    statusCode = HttpStatus.BAD_REQUEST,
                    data = null
                });
            }
        }


        [HttpGet("in-progress-understaffed")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> GetUnderstaffedInProgressAsync([FromQuery] AppointmentQueryDto model)
        {
            try
            {
                var data = await _appointmentService.GetUnderstaffedInProgressAsync(model);
                return Ok(new ResponseDto<PageResultDto<AppointmentInProgressUnderstaffedViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.APPOINTMENT_GET_SUCCESS,
                    data = data
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    message = ex.Message,
                    statusCode = HttpStatus.BAD_REQUEST,
                    data = null
                });
            }
        }

        [HttpGet("count-appointments-in-month/{year}/{month}")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> CountAppointmentsInMonth(int year, int month)
        {
            return Ok(new ResponseDto<int>
            {
                statusCode = HttpStatus.OK,
                message = Message.APPOINTMENT_GET_SUCCESS,
                data = await _appointmentService.CountAppointmentsInMonths(year, month)
            });
        }
        [HttpGet("count-customers-in-month/{year}/{month}")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> CountCustomersInMonth(int year, int month)
        {
            var result = await _appointmentService.CountCustomersInMonths(year, month);
            return Ok(new ResponseDto<int>
            {
                statusCode = HttpStatus.OK,
                message = Message.APPOINTMENT_GET_SUCCESS,
                data = result
            });
        }
        [HttpGet("count-appointments-with-status-in-month/{year}/{month}")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> CountAppointmentsInMonthWithStatus(int year, int month, AppointmentStatusEnum status)
        {
            return Ok(new ResponseDto<int>
            {
                statusCode = HttpStatus.OK,
                message = Message.APPOINTMENT_GET_SUCCESS,
                data = await _appointmentService.CountAppointmentsInMonthsWithStatus(year, month, status)
            });

        }
    }
}


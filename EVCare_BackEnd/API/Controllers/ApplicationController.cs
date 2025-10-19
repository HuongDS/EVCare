using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Applications;
using DataAccess.Dtos.Pagination;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationServices _applicationServices;

        public ApplicationController(IApplicationServices applicationServices)
        {
            this._applicationServices = applicationServices;
        }

        [HttpPost("send-application")]
        [Authorize(Roles = "Staff, Technician")]
        [ServiceFilter(typeof(GetAccountIdFilter))]
        public async Task<IActionResult> SendApplicationAsync(ApplicationEmployeeCreateDto data)
        {
            try
            {
                var employeeId = (int)HttpContext.Items["EmployeeId"];
                var createData = new ApplicationCreateDto
                {
                    employeeID = employeeId,
                    dateOff = data.dateOff,
                    reason = data.reason
                };
                var result = await _applicationServices.CreateApplicationAsync(createData);
                return Ok(new ResponseDto<int>
                {

                    statusCode = HttpStatus.OK,
                    message = Message.APPLICATION_SENT_SUCCESS,
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

        [HttpGet("get-application")]
        [Authorize(Roles = "Staff,Technician")]
        [ServiceFilter(typeof(SetEmployeeIdFilter))]
        public async Task<IActionResult> GetApplicationAsync([FromQuery] ApplicationQueryDto query)
        {
            try
            {
                var employeeId = (int)HttpContext.Items["EmployeeId"];
                var result = await _applicationServices.GetApplicationAsync(query, employeeId);
                return Ok(new ResponseDto<PageResultDto<ApplicationViewDto>>
                {
                    statusCode = HttpStatus.OK,
                    data = result,
                    message = Message.APPLICATION_GET_SUCCESS

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

        [HttpGet("get-dateoff")]
        [Authorize(Roles = "Staff,Technician")]
        [ServiceFilter(typeof(SetEmployeeIdFilter))]
        public async Task<IActionResult> GetDateOffAsync()
        {
            try
            {
                var employeeId = (int)HttpContext.Items["EmployeeId"];
                var result = await _applicationServices.GetDateOffAsync(employeeId);
                return Ok(new ResponseDto<List<DateOnly>>
                {
                    statusCode = HttpStatus.OK,
                    data = result,
                    message = Message.APPLICATION_GET_SUCCESS
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

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllApplicationsAsync([FromQuery] ApplicationQueryDto query)
        {
            try
            {
                var result = await _applicationServices.GetAllApplicationsAsync(query);
                return Ok(new ResponseDto<PageResultDto<ApplicationAdminViewDto>>
                {
                    statusCode = HttpStatus.OK,
                    data = result,
                    message = Message.APPLICATION_GET_SUCCESS
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
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateApplicationStatusAsync(ApplicationUpdateDto data)
        {
            try
            {

                await _applicationServices.UpdateApplicationAsync(data);
                return Ok(new ResponseDto<object>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.APPLICATION_UPDATE_SUCCESS,
                 
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

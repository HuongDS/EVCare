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
                var result = await _applicationServices.SendApplicationAsync(createData);
                return Ok(result);
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
                var result = await _applicationServices.GetApplicationAsync(query,employeeId);
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
    }
}

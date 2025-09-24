using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Applications;
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

        [HttpPost("/send-application")]
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
    }
}

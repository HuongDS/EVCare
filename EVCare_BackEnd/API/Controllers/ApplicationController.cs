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
        public async Task<IActionResult> SendApplicationAsync(ApplicationCreateDto data)
        {
            try
            {

                var result = await _applicationServices.SendApplicationAsync(data);
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

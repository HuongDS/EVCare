using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.ServiceCenter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceCenterController : ControllerBase
    {
        private readonly IServiceCenterService _serviceCenterService;
        public ServiceCenterController(IServiceCenterService serviceCenterService)
        {
            _serviceCenterService = serviceCenterService;
        }
        [HttpGet]
        public async Task<IActionResult> GetServiceCenterInfo()
        {
            try
            {
                var data = await _serviceCenterService.GetServiceCenterInformationAsync();
                return Ok(new ResponseDto<ServiceCenterViewModel>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.SERVICE_CENTER_GET_SUCCESSFULLY,
                    data = data
                });

            }
            catch (Exception ex) {

                return BadRequest(new ResponseDto<object>
                {
                   statusCode = HttpStatus.BAD_REQUEST,
                   message = ex.Message,
                   data = ex.StackTrace,
                });
                
            }
        }

        [HttpPut]
        //[Authorize(Roles ="Admin")]
        public async Task<IActionResult> UpdateServiceCenter(ServiceCenterViewModel model)
        {
            try
            {
                await _serviceCenterService.UpdateServiceCenterAsync(model);
                return Ok(new ResponseDto<object>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.SERVICE_CENTER_UPDATE_SUCCESSFULLY,

                });

            }catch(Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                    data = ex.StackTrace,
                });
            }
        }
     }
}

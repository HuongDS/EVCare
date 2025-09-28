using Application.Dtos;
using Application.Infrastructures;
using Application.IService;
using DataAccess.Dtos.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _service;
        public ServiceController(IServiceService service)
        {
            _service = service;
        }
        //admin
        [Authorize(Roles = "Admin")]
        [HttpGet()]
        public async Task<IActionResult> GetAllServices(string keyword,int? payload,int? pageindex)
        {
            if (keyword == null) {
                keyword = "";
            
            }
            if(payload.HasValue && pageindex.HasValue)
            {
                var services = await _service.GetServicesWithPaginationAsync(keyword,payload.Value, pageindex.Value);
                return Ok(new
                {
                    statusCode = 200,
                    message = "Successfully",
                    data = services
                });

            }
            else
            {
                var services = await _service.GetAllServicesAsync();
                return Ok(new
                {
                    statusCode = 200,
                    message = "Successfully",
                    data = services
                });

            }
               
        }
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveServices(string? keyword,int? payload, int? pageindex)
        {
            if (keyword == null) keyword = "";
            if (payload.HasValue && pageindex.HasValue)
            {
                var services = await _service.GetActiveServicesWithPaginationAsync(keyword,payload.Value, pageindex.Value);
                return Ok(new { statusCode = 200, message = "Successfully", data = services });
            }
            else
            {
                var services = await _service.GetAllActiveServicesAsync(keyword);
                return Ok(new { statusCode = 200, message = "Successfully", data = services });
            }
        }
        
        
        [HttpPost()]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> AddAService(ServicePostModel model)
        {
            try
            {
                var data = await _service.AddAService(model);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.CREATED,
                    message = Message.ADD_SERVICE_SUCCESSFULLY,
                    data = data
                });
                
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = Message.ADD_SERVICE_FALL,
                    data = null
                });
            }

        }
        [HttpDelete()]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAService(int serviceId)
        {
            try
            {
                if (serviceId <= 0) throw new Exception();
                _service.DeleteAService(serviceId);
                return Ok(new ResponseDto<object>
                {
                    statusCode = HttpStatus.NO_CONTENT,
                    message = Message.DELETE_SUCCESSFULLY,

                });


            }catch(Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = Message.DELETE_FAIL,
                    data = null
                });
            }
        }
        [HttpPut()]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult>UpdateAService(ServicePutModel model)
        {
            try
            {
                var data = await _service.UpdateAService(model);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    data = model.Id,
                    message = Message.UPDATE_SUCCESS
                });

            }catch(Exception ex)
            {
                return BadRequest(new ResponseDto<int>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = Message.UPDATE_FAIL,
                    data = model.Id,
                });

            }
        }
    }
}

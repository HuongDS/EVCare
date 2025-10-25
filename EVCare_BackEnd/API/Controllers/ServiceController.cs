using Application.Dtos;
using Application.Infrastructures;
using Application.IService;
using DataAccess.Dtos.Pagination;
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
        public async Task<IActionResult> GetAllServices([FromQuery] ServiceQueryDto model)
        {
            try
            {
                var data = await _service.GetServicesWithPaginationAsync(model);

                return Ok(new ResponseDto<PageResultDto<ServiceViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.GET_SERVICE_SUCCESSFULLY,
                    data = data
                });
            }
            catch (Exception ex)
            {


                return BadRequest(new ResponseDto<object>
                {
                    data = null,
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message

                });

            }


        }
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveServices([FromQuery] ServiceQueryDto model)
        {
            try
            {
                var data = await _service.GetActiveServicesWithPaginationAsync(model);

                return Ok(new ResponseDto<PageResultDto<ServiceViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.GET_SERVICE_SUCCESSFULLY,
                    data = data
                });
            }
            catch (Exception ex)
            {


                return BadRequest(new ResponseDto<object>
                {
                    data = null,
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message

                });

            }
        }


        [HttpPost()]
        [Authorize(Roles = "Admin")]
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
                await _service.DeleteAService(serviceId);
                return Ok(new ResponseDto<object>
                {
                    statusCode = HttpStatus.NO_CONTENT,
                    message = Message.DELETE_SUCCESSFULLY,

                });


            }
            catch (Exception ex)
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
        public async Task<IActionResult> UpdateAService(ServicePutModel model)
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

            }
            catch (Exception ex)
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

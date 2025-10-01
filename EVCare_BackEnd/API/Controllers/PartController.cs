using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartController : ControllerBase
    {
        private readonly IPartService _partService;
        public PartController(IPartService partService)
        {
            _partService = partService;
        }
        [HttpGet]
        [Authorize(Roles ="Technician")]
        public async Task<IActionResult> GetAllParts([FromQuery]PartQueryDto model)
        {
            try
            {
                var data = await _partService.GetAllParts(model);
                return Ok(new ResponseDto<PageResultDto<PartViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.PART_GET_SUCCESSFULLY,
                    data = data
                });

            }
            catch (Exception ex)
            {

                return BadRequest(new ResponseDto<object>
                {
                    data = null,
                    message = ex.Message,
                    statusCode = HttpStatus.BAD_REQUEST,
                }); 

            }
        }
    }
}

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
        [Authorize(Roles = "Technician, Staff")]
        public async Task<IActionResult> GetAllParts([FromQuery] PartQueryDto model)
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

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreatePart(PartCreateModel model)
        {
            try
            {
                var data = await _partService.CreateAPart(model);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.CREATED,
                    message = Message.PART_CREATE_SUCCESSFULLY,
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

        [HttpPut()]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePart([FromQuery] int id, [FromBody] PartStaffUpdateModel model)
        {
            try
            {
                await _partService.UpdateAPart(id, model);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.PART_UPDATE_SUCCESSFULLY,

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

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAPart(int id)
        {
            try
            {
                await _partService.DeleteAPart(id);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.PART_DELETE_SUCCESSFULLY,
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

        [HttpGet("export")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> ExportParts()
        {
            try
            {
                var content = await _partService.ExportPartAsync();

                var fileName = $"Parts_{DateOnly.FromDateTime(DateTime.Now)}.xlsx";
                return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);

            }
            catch(Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }
    }
}

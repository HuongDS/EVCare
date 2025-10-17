using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.PartCategory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartCategoryController : ControllerBase
    {
        private readonly IPartCategoryService _partCategoryService;
        public PartCategoryController(IPartCategoryService partCategoryService)
        {
            _partCategoryService = partCategoryService;
        }

        [HttpGet]
        [Authorize(Roles ="Technician,Admin")]
        public async Task<IActionResult> GetCategories([FromQuery]CategoryQueryDto model)
        {
            try
            {
                var data = await _partCategoryService.GetCategories(model);
                return Ok(new ResponseDto<PageResultDto<PartCategoryViewModel>>{
                    data = data,
                    message = Message.PART_Category_GET_SUCCESSFULLY,
                    statusCode = HttpStatus.OK,
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                }); ;

            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCategory(PartCategoryCreateModel model)
        {
            try
            {
                var data = await _partCategoryService.CreateCategory(model);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.CREATED,
                    message = Message.PART_Category_CREATE_SUCCESSFULLY,
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

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]    
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                await _partCategoryService.DeleteCategory(id);
                return Ok(new ResponseDto<object>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.PART_Category_DELETE_SUCCESSFULLY,
                    data = null
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

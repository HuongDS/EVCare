using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.TechnicianCategory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TechnicianCategoryController : ControllerBase
    {
        private readonly ITechnicianCategoryService _technicianCategoryService;
        public TechnicianCategoryController(ITechnicianCategoryService technicianCategoryService)
        {
            _technicianCategoryService = technicianCategoryService;
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllTechnicianCategories([FromQuery]TechnicianCategoryDto model)
        {
            try
            {
                var data = await _technicianCategoryService.GetAllTechnicianCategories(model);
                return Ok(new ResponseDto<PageResultDto<TechnicianCategoryViewModel>>
                {
                     data = data,
                     message = Message.TECHNICIAN_CATEGORY_GET_SUCCESSFULLY,
                     statusCode = HttpStatus.OK,
                });

            }
            catch(Exception ex)
            {
               return BadRequest(new ResponseDto<object>
                {
                    message = ex.Message,
                    statusCode = HttpStatus.BAD_REQUEST,
                    data = null
               });
            }
        }

        
    }
}

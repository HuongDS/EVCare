using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.ServiceCategory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceCategoryController : ControllerBase
    {
        private readonly IServiceCategoryService _serviceCategoryService;
        public ServiceCategoryController(IServiceCategoryService serviceCategoryService) {
        
          _serviceCategoryService = serviceCategoryService;
        }
        [HttpGet()]
        public async Task<IActionResult> GetAll() {

            try
            {
                var data = await _serviceCategoryService.GetServiceCategoryAndService();
                return Ok(new ResponseDto<IEnumerable<ServiceCategoryViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.SERVICE_CATEGORY_GET_SUCCESSSFULLY,
                    data = data

                });
            }
            catch (Exception ex) {

                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message
                });

            }
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllForAdmin([FromQuery] ServiceCategoryQueryDto model) {
            try {
                var data = await _serviceCategoryService.GetSrvicecategoryViewDto(model);
                return Ok(new ResponseDto<PageResultDto<ServiceCategoryViewDto>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.SERVICE_CATEGORY_GET_SUCCESSSFULLY,
                    data = data
                });
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message
                });
            }
        }

        //[HttpPost]





    }
}

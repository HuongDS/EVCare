using Application.Infrastructures;
using Application.Interfaces;
using DocumentFormat.OpenXml.Presentation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleCategoryController : ControllerBase {
        private readonly IVehicleCategoryService _vehicleCategoryService;
        public VehicleCategoryController(IVehicleCategoryService vehicleCategoryService) {
            _vehicleCategoryService = vehicleCategoryService;
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetAllActiveCategories() {
            try {
                var categories = await _vehicleCategoryService.GetAllActiveCategoriesAsync();
                return Ok(new
                {
                    statusCode = 200,
                    message = "Success",
                    data = categories
                });
            }
            catch (Exception ex) {
                return BadRequest(new
                {
                    statusCode = 400,
                    message = ex.Message
                });
            }
        }

        [HttpGet("{id}/detail")]
        public async Task<IActionResult> GetCategoryDetail(int id) {
            try {
                var categoryDetail = await _vehicleCategoryService.GetCategoryDetailAsync(id);
                return Ok(new
                {
                    statusCode = HttpStatus.OK,
                    message = "Success",
                    data = categoryDetail
                });
            }
            catch (Exception ex) {
                return BadRequest(new
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }

        }
    }
}

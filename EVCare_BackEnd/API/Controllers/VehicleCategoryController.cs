using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleCategoryController : ControllerBase
    {
        private readonly IVehicleCategoryService _vehicleCategoryService;
        public VehicleCategoryController(IVehicleCategoryService vehicleCategoryService)
        {
            _vehicleCategoryService = vehicleCategoryService;
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetAllActiveCategories()
        {
            try
            {
                var categories = await _vehicleCategoryService.GetAllActiveCategoriesAsync();
                return Ok(new
                {
                    statusCode = 200,
                    message = "Success",
                    data = categories
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    message = ex.Message
                });
            }
        }

    }
}

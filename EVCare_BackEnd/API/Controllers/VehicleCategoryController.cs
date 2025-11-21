using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.VehicleCategory;
using DocumentFormat.OpenXml.Presentation;
using Microsoft.AspNetCore.Authorization;
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

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCategory(VehicleCategoryCreateModel model) {
            try {
                var createdCategory = await _vehicleCategoryService.CreateCategoryAsync(model);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.CREATED,
                    message = Message.VEHICLE_CATEGORY_CREATE_SUCCESSFULLY,
                    data = createdCategory
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

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(int id, VehicleCategoryCreateModel model) {
            try {

                await _vehicleCategoryService.UpdateCategoryAsync(id, model);

                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.VEHICLE_CATEGORY_UPDATE_SUCCESSFULLY,
                    data = id
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


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id) {
            try {
                await _vehicleCategoryService.DeleteCategoryAsync(id);
                return Ok(new ResponseDto<object>
                {
                    statusCode = HttpStatus.NO_CONTENT,
                    message = Message.VEHICLE_CATEGORY_DELETE_SUCCESSFULLY,
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

        [HttpPut("unbanned-vehicleCategory/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UnbannedVehicleCategory(int id) {
            try {
                await _vehicleCategoryService.UnbannedVehicleCategoryAsync(id);
                return Ok(new ResponseDto<object>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.VEHICLE_CATEGORY_UNBANNED_SUCCESSFULLY,
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

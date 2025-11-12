using System.Threading.Tasks;
using API.Filters;
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
    public class PartController : ControllerBase {
        private readonly IPartService _partService;
        public PartController(IPartService partService) {
            _partService = partService;
        }

        [HttpGet("template")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPartImportTemplate() {
            try {
                var content = await _partService.GetPartImportTemplate();
                var fileName = "Part_Import_Template.xlsx";
                return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }


        [HttpGet]
        [Authorize(Roles = "Technician, Staff,Admin")]
        public async Task<IActionResult> GetAllParts([FromQuery] PartQueryDto model) {
            try {
                var data = await _partService.GetAllParts(model);
                return Ok(new ResponseDto<PageResultDto<PartViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.PART_GET_SUCCESSFULLY,
                    data = data
                });

            }
            catch (Exception ex) {

                return BadRequest(new ResponseDto<object>
                {
                    data = null,
                    message = ex.Message,
                    statusCode = HttpStatus.BAD_REQUEST,
                });

            }
        }

        [HttpGet("service-parts")]
        [Authorize(Roles = "Technician, Staff,Admin")]
        public async Task<IActionResult> GetPartsForService([FromQuery] PartForServiceQueryDto model) {
            try {
                var data = await _partService.GetPartsForService(model);
                return Ok(new ResponseDto<PageResultDto<PartViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.PART_GET_SUCCESSFULLY,
                    data = data
                });
            }
            catch (Exception ex) {
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
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> CreatePart(PartCreateModel model) {
            try {
                var accountId = (int)HttpContext.Items["AccountId"];
                var data = await _partService.CreateAPart(model, accountId);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.CREATED,
                    message = Message.PART_CREATE_SUCCESSFULLY,
                    data = data
                });
            }
            catch (Exception ex) {
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
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> UpdatePart([FromQuery] int id, [FromBody] PartAdminUpdateModel model) {
            try {
                var accountId = (int)HttpContext.Items["AccountId"];
                await _partService.UpdateAPart(id, model, accountId);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.PART_UPDATE_SUCCESSFULLY,

                });
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    data = null,
                    message = ex.Message,
                    statusCode = HttpStatus.BAD_REQUEST,
                });
            }
        }

        [HttpPut("staff")]
        [Authorize(Roles = "Staff")]
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> StaffUpdatePart([FromBody] PartStaffUpdateModel model) {
            try {
                var accountId = (int)HttpContext.Items["AccountId"];
                await _partService.StaffUpdateAPart(model, accountId);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.PART_UPDATE_SUCCESSFULLY,
                });
            }
            catch (Exception ex) {
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
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> DeleteAPart(int id) {
            try {
                var accountId = (int)HttpContext.Items["AccountId"];
                await _partService.DeleteAPart(id, accountId);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.PART_DELETE_SUCCESSFULLY,
                });

            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    data = null,
                    message = ex.Message,
                    statusCode = HttpStatus.BAD_REQUEST,
                });
            }
        }

        [HttpPut("{id}/restore")]
        [Authorize(Roles = "Admin")]
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> RestorePart(int id) {
            try {
                var accountId = (int)HttpContext.Items["AccountId"];
                await _partService.RestoreAPartSave(id, accountId);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = "Restore part successfully",
                });
            }
            catch (Exception ex) {
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
        public async Task<IActionResult> ExportParts() {
            try {
                var content = await _partService.ExportPartAsync();

                var fileName = $"Parts_{DateOnly.FromDateTime(DateTime.Now)}.xlsx";
                return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);

            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }

        [HttpPost("import")]
        [Authorize(Roles = "Admin")]
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> ImportParts(IFormFile file) {
            try {
                var accountId = (int)HttpContext.Items["AccountId"];
                var result = await _partService.ImportPartAsync(file, accountId);
                if (result.HasError) {
                    var fileContent = _partService.GeneratePartImportErrorFile(result.Errors);
                    var fileName = $"Part_Import_Errors_{DateOnly.FromDateTime(DateTime.Now)}.xlsx";
                    return File(fileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
                else {
                    return Ok(new ResponseDto<object>
                    {
                        statusCode = HttpStatus.OK,
                        message = "Import parts successfully"
                    });
                }
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }

        [HttpGet("total-price")]
        [Authorize(Roles = "Admin, Staff, Technician")]
        public async Task<IActionResult> GetTotalPriceOfParts() {
            try {
                var totalPrice = await _partService.GetTotalPriceOfParts();
                return Ok(new ResponseDto<decimal>
                {
                    statusCode = HttpStatus.OK,
                    message = "Get total price of parts successfully",
                    data = totalPrice
                });
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }

        [HttpGet("low-stock")]
        [Authorize(Roles = "Admin, Staff, Technician")]
        public async Task<IActionResult> GetLowStockParts() {
            try {
                var data = await _partService.GetLowStockParts();

                return Ok(new ResponseDto<IEnumerable<PartViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = "Get low stock parts successfully",
                    data = data
                });
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }
    }
}

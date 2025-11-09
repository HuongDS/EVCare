using Application.Dtos;
using Application.Interfaces;
using DataAccess.Dtos.BlockedDate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlockedDateController : ControllerBase {
        private readonly IBlockedDateService _blockedDateService;
        public BlockedDateController(IBlockedDateService blockedDateService) {
            _blockedDateService = blockedDateService;
        }

        [HttpGet]
        [AllowAnonymous]
     
        public async Task<IActionResult> GetBlockedDate() {
            try {
                var dates = await _blockedDateService.GetBlockedDateFromToday();
                return Ok(new ResponseDto<IEnumerable<BlockedDateViewModel>>
                {
                    statusCode = 200,
                    message = "Sucessfully",
                    data = dates
                });

            }
            catch (Exception ex) {

                return BadRequest(new ResponseDto<Object>
                {
                    statusCode = 400, message = ex.Message

                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<IActionResult> PostBlockedDate(BlockedDatePostModel model) {
            try {
                int postId = await _blockedDateService.CreatePost(model);
                return Ok(new ResponseDto<int>
                {
                    statusCode = 201,
                    message = "Create sucessfully",
                    data = postId
                });

            }
            catch (Exception ex) {

                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,


                });

            }

        }
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutBlockedDate(BlockedDatePostModel model) {
            try {
                await _blockedDateService.UpdateBlockedDate(model);
                return Ok(new ResponseDto<object>
                {
                    statusCode = 200,
                    message = "Update sucessfully",
                });
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                });
            }
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBlockedDate(DateOnly date) {
            try {
                await _blockedDateService.DeleteBlockedDate(date);
                return Ok(new ResponseDto<object>
                {
                    statusCode = 204,
                    message = "Delete sucessfully",
                });
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                });
            }
        }
    }

 }

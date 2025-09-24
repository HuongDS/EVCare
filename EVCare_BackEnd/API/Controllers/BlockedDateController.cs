using Application.Dtos;
using Application.Interfaces;
using DataAccess.Dtos.BlockedDate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlockedDateController : ControllerBase
    {
        private readonly IBlockedDateService _blockedDateService;
        public BlockedDateController(IBlockedDateService blockedDateService)
        {
            _blockedDateService = blockedDateService;
        }

        [HttpGet]
        //trả về những ngày đã bị block tính từ hôm nay
        public async Task<IActionResult> GetBlockedDate()
        {
            try
            {
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
        public async Task<IActionResult> PostBlockedDate(BlockedDatePostModel model)
        {
            try
            {
                int postId = await _blockedDateService.CreatePost(model);
                return Ok(new ResponseDto<int>
                {
                    statusCode = 200,
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
    }
}

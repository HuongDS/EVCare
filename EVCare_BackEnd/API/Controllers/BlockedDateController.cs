using Application.Interfaces;
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
        public Task<IActionResult> GetBlockedDate()
        {
            try
            {
                return null;

            }
            catch (Exception ex) {

                return null;
            }
        }
    }
}

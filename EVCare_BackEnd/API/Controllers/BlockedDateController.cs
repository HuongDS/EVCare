using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlockedDateController : ControllerBase
    {
        [HttpGet]
        //trả về những ngày đã bị block tính từ hôm nay
        public Task<IActionResult> GetBlockedDate()
        {
            return null;
        }
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlertController : ControllerBase
    {
        [HttpGet]
        public Task<IActionResult> GetAlertByAccountId(int accountId)
        {
            return null;
        }
    }
}

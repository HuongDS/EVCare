using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [HttpPost("/create-order")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> CreateOrder(OrderCreateRequestDto data)
        {
            try
            {
                var response = await _orderService.CreateOrderAsync(data);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }
    }
}

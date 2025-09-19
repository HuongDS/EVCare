using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.OrderParts;
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
        [HttpPost("/add-parts-to-order")]
        [Authorize(Roles = "Technician")]
        public async Task<IActionResult> AddPartsToOrder(OrderPartsAddDto data)
        {
            try
            {
                var response = await _orderService.AddPartsToOrder(data.listParts, data.orderId);
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

        [HttpPost("/update-order-status")]
        [Authorize(Roles = "Staff, Technician")]
        public async Task<IActionResult> UpdateOrderStatus(OrderUpdateStatusDto data)
        {
            try
            {
                var response = await _orderService.UpdateStatusOrderAsync(data);
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

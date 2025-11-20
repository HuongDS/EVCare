using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.OrderDetailLog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailLogController : ControllerBase {
        private readonly IOrderDetailLogService _orderDetailLogService;
        public OrderDetailLogController(IOrderDetailLogService orderDetailLogService) {
            _orderDetailLogService = orderDetailLogService;
        }
        [HttpGet()]
        [Authorize]
        [ServiceFilter(typeof(SetCustomerIdFilter))]
        [ServiceFilter(typeof(AuthorizeCustomerAndStaffForOrder))]
        public async Task<IActionResult> GetLog(int orderId) {
            try {      
                var result = await _orderDetailLogService.GetLogByOrderId(orderId);
                return Ok(new ResponseDto<OrderDetailLogViewModel>
                {
                    statusCode = HttpStatus.OK,
                    message = "Order detail logs retrieved successfully",
                    data =  result
                });

            } catch (Exception e) {

                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = e.Message,

                });
            }
        }

    }
}

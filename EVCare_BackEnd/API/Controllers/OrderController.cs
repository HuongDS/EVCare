using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.OrderParts;
using DataAccess.Dtos.Orders;
using DataAccess.Interfaces;
using DataAccess.Repositories;
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
        private readonly ITechnicianRepository _technicianRepository;

        public OrderController(IOrderService orderService, ITechnicianRepository technicianRepository)
        {
            _orderService = orderService;
            _technicianRepository = technicianRepository;
        }
        [HttpPost("create-order")]
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
        [HttpPost("add-parts-to-order")]
        [Authorize(Roles = "Technician")]
        [ServiceFilter(typeof(SetEmployeeIdFilter))]
        public async Task<IActionResult> AddPartsToOrder(OrderPartsAddDto data)
        {
            try
            {
                var employeeId = (int)HttpContext.Items["EmployeeId"];
                var technician = await _technicianRepository.GetTechnicianByEmployeeID(employeeId);
                var technicianId = technician.Id;
                var newAddList = data.listParts.Select(part => new OrderPartAddDto
                {
                    partID = part.partID,
                    quantity = part.quantity,
                    technicianId = technicianId,
                    orderId = data.orderId
                }).ToList();
                var response = await _orderService.AddPartsToOrder(newAddList, data.orderId);
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

        [HttpPost("update-order-status")]
        [Authorize(Roles = "Staff")]
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
        [HttpGet("get-order-detail/{orderId}")]
        [Authorize(Roles ="Staff")]
        public async Task<IActionResult> GetOrderDetail(int orderId)
        {
            try
            {
                var data =  await _orderService.GetOrderDetailAsync(orderId);
                return Ok(new ResponseDto<OrderViewModel> {
                    
                    statusCode = HttpStatus.OK,
                    message = Message.ORDER_GET_SUCCESS,
                    data = data      
                });

            }catch(Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOrder(OrderUpdateModel model)
        {
            try
            {

            }catch(Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }
    }
}

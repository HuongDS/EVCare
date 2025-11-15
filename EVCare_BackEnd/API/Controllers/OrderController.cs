using API.Filters;
using Application.DomainEvents;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using Azure;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.OrderParts;
using DataAccess.Dtos.Orders;
using DataAccess.Enums;
using DataAccess.Interfaces;
using DataAccess.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase {
        private readonly IOrderService _orderService;
        private readonly ITechnicianRepository _technicianRepository;
        private readonly OnStatusOrderChange _onStatusOrderChange;

        public OrderController(IOrderService orderService, ITechnicianRepository technicianRepository,
           OnStatusOrderChange onStatusOrderChange) {
            _orderService = orderService;
            _technicianRepository = technicianRepository;
            _onStatusOrderChange = onStatusOrderChange;
        }
        [HttpPost("create-order")]
        [Authorize(Roles = "Staff")]
        [ServiceFilter(typeof(SetEmployeeIdFilter))]
        [ServiceFilter(typeof(AuthorizeEmployeeIsAbsent))]
        public async Task<IActionResult> CreateOrder(OrderCreateRequestDto data) {
            try {
                var response = await _orderService.CreateOrderAsync(data);
                return Ok(response);
            }
            catch (Exception ex) {
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
        public async Task<IActionResult> AddPartsToOrder(OrderPartsAddDto data) {
            try {
                var employeeId = (int)HttpContext.Items["EmployeeId"];
                var technician = await _technicianRepository.GetTechnicianByEmployeeID(employeeId);
                var technicianIds = new[] { technician.Id };
                var newAddList = data.listParts.Select(part => new OrderPartAddDto
                {
                    partID = part.partID,
                    quantity = part.quantity,
                    technicianId = technicianIds[0],
                    orderId = data.orderId
                }).ToList();
                var response = await _orderService.AddPartsToOrder(newAddList, data.orderId);
                //await _onStatusOrderChange.HandleAsync<OrderPartsViewDto>(OrderStatusChangeEventEnum.OrderConfirmed, technicianIds, response.data);
                return Ok(response);
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }

        [HttpPut("parts")]
        [Authorize(Roles = "Technician")]
        [ServiceFilter(typeof(SetTechnicianIdFilter))]
        public async Task<IActionResult> UpdatePartsToOrder(OrderPartAddModel model) {
            try {
                int technicianId = (int)HttpContext.Items["TechnicianId"];
                await _orderService.UpdatePartToOrder(model, technicianId);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    data = model.OrderId,
                    message = Message.ORDER_PARTS_UPDATE_SUCCESS
                });

            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                    data = null
                });

            }

        }

        [HttpPost("update-order-status")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> UpdateOrderStatus(OrderUpdateStatusDto data) {
            try {
                var response = await _orderService.UpdateStatusOrderAsync(data);
                await _onStatusOrderChange.HandleAsync<OrderResponseDto>(OrderStatusChangeEventEnum.OrderStatusUpdate, null, response.data);
                return Ok(response);
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }
        [HttpGet("get-order-detail/{orderId}")]
        [Authorize(Roles = "Staff,Customer,Technician")]
        [ServiceFilter(typeof(SetCustomerIdFilter))]
        [ServiceFilter(typeof(AuthorizeCustomerAndStaffForOrder))]

        public async Task<IActionResult> GetOrderDetail(int orderId) {
            try {
                var data = await _orderService.GetOrderDetailAsync(orderId);
                return Ok(new ResponseDto<OrderViewModel>
                {

                    statusCode = HttpStatus.OK,
                    message = Message.ORDER_GET_SUCCESS,
                    data = data
                });

            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }

        [HttpPut]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> UpdateOrder(OrderUpdateModel model) {
            try {
                await _orderService.UpdateOrderAsync(model);
                await _onStatusOrderChange.HandleAsync<object>(OrderStatusChangeEventEnum.StaffConfirmed, null, null);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = "Sucess",
                    data = model.Id
                });

            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }

        [HttpPost("parts")]
        [Authorize(Roles = "Technician")]
        [ServiceFilter(typeof(SetTechnicianIdFilter))]
        public async Task<IActionResult> AddOrderPart(OrderPartAddModel model) {
            try {
                int technicianId = (int)HttpContext.Items["TechnicianId"];
                await _orderService.AddPartsToAnOrder(model, technicianId);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.CREATED,
                    message = Message.ORDER_PARTS_ADDED_SUCCESS,
                    data = model.OrderId
                });


            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                    data = null
                });
            }
        }
        [HttpGet("technician-orders")]
        [Authorize(Roles = "Technician")]
        [ServiceFilter(typeof(SetTechnicianIdFilter))]
        public async Task<IActionResult> GetOrdersForTechnician([FromQuery] int orderId) {
            try {
                int technicianId = (int)HttpContext.Items["TechnicianId"];
                var response = await _orderService.GetOrdersForTechnicianAsync(technicianId, orderId);
                return Ok(new ResponseDto<IEnumerable<OrderPartViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.ORDER_PARTS_GET_SUCCESS,
                    data = response
                });
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                    data = null
                });
            }


        }

        [HttpPut("part/status")]
        [Authorize(Roles = "Technician")]
        [ServiceFilter(typeof(SetTechnicianIdFilter))]
        public async Task<IActionResult> UpdateOrderPartStatus(OrderPartStatusUpdateModel model) {
            try {
                int technicianId = (int)HttpContext.Items["TechnicianId"];
                await _orderService.UpdateOrderPartStatusAsync(model, technicianId);
                return Ok(new ResponseDto<int>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.ORDER_PARTS_STATUS_UPDATE_SUCCESS,
                    data = model.OrderId
                });
            }
            catch (Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                    data = null
                });
            }

        }
    }
}

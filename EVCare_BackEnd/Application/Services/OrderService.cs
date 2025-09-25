using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.OrderParts;
using DataAccess.Dtos.Orders;
using DataAccess.Entities;
using DataAccess.Interfaces;
using DataAccess.Repositories;
using Microsoft.AspNetCore.Mvc.RazorPages;
using StackExchange.Redis;
using Order = DataAccess.Entities.Order;

namespace Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;
        private readonly IOrderPartRepository _orderPartRepository;
        private readonly IPartRepository _partRepository;

        public OrderService(IOrderRepository orderRepository, IAppointmentRepository appointmentRepository,
            IMapper mapper, IOrderPartRepository orderPartRepository, IPartRepository partRepository)
        {
            _orderRepository = orderRepository;
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
            _orderPartRepository = orderPartRepository;
            _partRepository = partRepository;
        }
        public async Task<ResponseDto<OrderResponseDto>> CreateOrderAsync(OrderCreateRequestDto data)
        {
            var checkAppointment = await _appointmentRepository.GetByIdAsync(data.appointmentID);
            if (checkAppointment is null)
            {
                throw new Exception(Message.APPOINTMENT_NOT_FOUND);
            }
            var newOrder = _mapper.Map<Order>(data);
            var addedEntity = await _orderRepository.AddAsync(newOrder);
            var appointment = await _appointmentRepository.GetByIdAsync(data.appointmentID);
            appointment.OrderId = addedEntity.Id;
            await _appointmentRepository.UpdateAsync(appointment);
            return new ResponseDto<OrderResponseDto>
            {
                statusCode = 200,
                message = Message.ORDER_CREATED_SUCCESS,
                data = _mapper.Map<OrderResponseDto>(addedEntity)
            };
        }
        public async Task<ResponseDto<OrderPartsViewDto>> AddPartsToOrder(List<OrderPartAddDto> data, int orderId)
        {
            var checkOrderID = await _orderRepository.GetByIdAsync(orderId);
            if (checkOrderID is null)
            {
                throw new Exception(Message.ORDER_NOT_FOUND);
            }
            var orderParts = _mapper.Map<List<OrderPart>>(data);

            try
            {
                foreach (var item in orderParts)
                {
                    await _partRepository.UpdateStockPartAsync(item.PartId, item.Quantity);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            await _orderPartRepository.AddRangeAsync(orderParts);
            var listParts = _mapper.Map<OrderPartsViewDto>(data);
            return new ResponseDto<OrderPartsViewDto>
            {
                statusCode = 200,
                message = Message.ORDER_PARTS_ADDED_SUCCESS,
                data = listParts,
            };
        }
        public async Task<ResponseDto<OrderResponseDto>> UpdateStatusOrderAsync(OrderUpdateStatusDto data)
        {
            var order = await _orderRepository.GetByIdAsync(data.orderID);
            if (order is null)
            {
                throw new Exception(Message.ORDER_NOT_FOUND);
            }
            order.Status = data.status;
            await _orderRepository.UpdateAsync(order);
            return new ResponseDto<OrderResponseDto>
            {
                statusCode = 200,
                message = Message.ORDER_STATUS_UPDATED_SUCCESS,
                data = _mapper.Map<OrderResponseDto>(order)
            };
        }
        public async Task<(StringBuilder, decimal)> GetOrderPartViewModelsAsync(int orderId)
        {
            var orderparts = await _orderPartRepository.GetOrderPartViewModelAsync(orderId);
            var orderPartRows = new StringBuilder();
            decimal total = 0;
            foreach (var op in orderparts)
            {
                orderPartRows.Append($@"
                <tr>
                    <td style=""padding:10px; border:1px solid #ddd;"">{op.partID}</td>
                    <td style=""padding:10px; border:1px solid #ddd;"">{op.partName}</td>
                    <td style=""padding:10px; border:1px solid #ddd; text-align:center;"">{op.quantity}</td>
                    <td style=""padding:10px; border:1px solid #ddd; text-align:right;"">{op.price:N0}</td>
                    <td style=""padding:10px; border:1px solid #ddd; text-align:right;"">{(op.quantity * op.price):N0}</td>
                </tr>");
                total += op.quantity * op.price;
            }
            return (orderPartRows, total);
        }
        public async Task<int> GetAppointmentIdByOrderIdAsync(int orderId)
        {
            return await _orderRepository.GetAppointmentIdByOrderId(orderId);
        }
    }
}

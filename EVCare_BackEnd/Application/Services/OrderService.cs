using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Orders;
using DataAccess.Entities;
using DataAccess.Interfaces;
using DataAccess.Repositories;
using StackExchange.Redis;
using Order = DataAccess.Entities.Order;

namespace Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository orderRepository, IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
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
            return new ResponseDto<OrderResponseDto>
            {
                statusCode = 200,
                message = Message.ORDER_CREATED_SUCCESS,
                data = _mapper.Map<OrderResponseDto>(addedEntity)
            };
        }
    }
}

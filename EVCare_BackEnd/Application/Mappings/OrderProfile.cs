using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Orders;
using DataAccess.Entities;
using DataAccess.Enums;

namespace Application.Mappings
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<OrderCreateRequestDto, Order>()
                .ForMember(dest => dest.AppointmentId, opt => opt.MapFrom(src => src.appointmentID))
                .ForMember(dest => dest.Create_At, opt => opt.MapFrom(src => src.created_At))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => OrderStatusEnum.Pending));

            CreateMap<Order, OrderResponseDto>()
                .ForMember(dest => dest.orderID, opt => opt.MapFrom(src => src.Id));
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Resolver;
using AutoMapper;
using DataAccess.Dtos.OrderParts;
using DataAccess.Entities;


namespace Application.Mappings
{
    public class OrderPartsProfile : Profile
    {
        public OrderPartsProfile()
        {
            CreateMap<List<OrderPartAddDto>, OrderPartsViewDto>()
                .ForMember(dest => dest.listParts, opt => opt.MapFrom(src => src));
            CreateMap<OrderPartAddDto, OrderPart>()
                .ForMember(dest => dest.PartId, opt => opt.MapFrom(src => src.partID))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ForMember(dest => dest.Price, opt => opt.MapFrom<PartPriceResolver>())
                .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.orderId))
                .ForMember(dest => dest.TechnicianId, opt => opt.MapFrom(src => src.technicianId));
        }
    }
}

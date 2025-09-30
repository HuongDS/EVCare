using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Others;
using DataAccess.Dtos.Service;
using DataAccess.Dtos.ServiceCenter;
using DataAccess.Entities;

namespace Application.Mappings
{
    public class ServiceCenterProfile : Profile
    {
        public ServiceCenterProfile()
        {
            CreateMap<ServiceCenter, ServiceCenterViewDto>()
                .ForMember(dest => dest.centerName, opt =>
                opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.centerAddress, opt =>
                opt.MapFrom(src => src.Address));

            CreateMap<ServiceCenterViewModel, ServiceCenter>()
                .ForMember(dest => dest.Name, opt =>
                {
                    opt.PreCondition(src => !string.IsNullOrEmpty(src.Name));
                })
                .ForMember(dest => dest.Address, opt =>
                {
                    opt.PreCondition(src => !string.IsNullOrEmpty(src.Address));
                })
                .ForMember(dest => dest.OpenTime, opt =>
                {
                    opt.PreCondition(src => src.OpenTime != null);
                })
                .ForMember(dest => dest.CloseTime, opt =>
                {
                    opt.PreCondition(src => src.CloseTime != null);
                })
                .ForMember(dest => dest.Hotline, opt =>
                {
                    opt.PreCondition(src => !string.IsNullOrEmpty(src.Hotline));
                })
                .ReverseMap();
        }
    }
}

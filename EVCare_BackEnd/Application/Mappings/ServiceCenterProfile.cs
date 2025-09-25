using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Others;
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
        }
    }
}

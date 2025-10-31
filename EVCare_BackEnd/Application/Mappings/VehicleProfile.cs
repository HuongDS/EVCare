using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Vehicle;
using DataAccess.Entities;

namespace Application.Mappings
{
    public class VehicleProfile : Profile
    {
        public VehicleProfile()
        {
            CreateMap<VehicleCreateModel, Vehicle>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.img));
            CreateMap<VehicleCustomerUpdateModel, Vehicle>();
            CreateMap<Vehicle, VehicleViewModel>()
                .ForMember(dest => dest.CategoryName, otp => otp.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.cateId, otp => otp.MapFrom(src => src.CategoryId))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image));
            CreateMap<Vehicle, VehicleDetailViewModel>()
                .ForMember(dest => dest.CategoryName, otp => otp.MapFrom(src => src.Category.Name));

            CreateMap<VehicleStaffUpdateModel, Vehicle>();


        }
    }
}

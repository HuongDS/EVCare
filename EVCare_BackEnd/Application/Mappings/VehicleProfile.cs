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
            CreateMap<VehicleCreateModel, Vehicle>();
            CreateMap<VehicleCustomerUpdateModel, Vehicle>();
            CreateMap<Vehicle, VehicleViewModel>()
                .ForMember(dest=>dest.CategoryName,otp=>otp.MapFrom(src=>src.Category.Name));


        }
    }
}

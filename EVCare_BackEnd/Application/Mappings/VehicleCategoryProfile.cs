using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.VehicleCategory;
using DataAccess.Entities;

namespace Application.Mappings
{
    public class VehicleCategoryProfile : Profile
    {
        public VehicleCategoryProfile()
        {
            CreateMap<VehiclesCategory, VehicleCategoryViewModel>();
        }
    }
}

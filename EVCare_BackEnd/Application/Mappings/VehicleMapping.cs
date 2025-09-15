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
    public class VehicleMapping : Profile
    {
        public VehicleMapping()
        {
            CreateMap<VehicleCreateModel, Vehicle>();


        }
    }
}

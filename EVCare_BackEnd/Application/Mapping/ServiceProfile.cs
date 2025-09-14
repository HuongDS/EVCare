using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Service;
using DataAccess.Entities;

namespace Application.Mapping
{
    public class ServiceProfile : Profile
    {
        public ServiceProfile()
        {
            CreateMap<DataAccess.Entities.Service,ServiceViewModel>().ReverseMap();
        }
    }
}

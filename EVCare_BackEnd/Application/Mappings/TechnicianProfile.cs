using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Technicians;
using DataAccess.Entities;

namespace Application.Mappings
{
    public class TechnicianProfile : Profile
    {
        public TechnicianProfile()
        {
            CreateMap<AssignTechnicianDto, TechnicianWorkingSession>()
                .ForMember(dest => dest.OrderId, opt =>
                opt.MapFrom(src => src.orderID))
                .ForMember(dest => dest.TechnicianId, opt =>
                opt.MapFrom(src => src.technicianID))
                .ForMember(dest => dest.Status, opt =>
                opt.MapFrom(src => src.status))
                .ForMember(dest => dest.StartTime, opt =>
                opt.MapFrom(src => src.startedTime));
        }
    }
}

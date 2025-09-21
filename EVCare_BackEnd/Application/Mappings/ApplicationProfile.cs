using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Applications;

namespace Application.Mappings
{
    public class ApplicationProfile : Profile
    {
        public ApplicationProfile()
        {
            CreateMap<ApplicationCreateDto, DataAccess.Entities.Application>()
                .ForMember(dest => dest.EmployeeId, opt =>
                opt.MapFrom(src => src.employeeID))
                .ForMember(dest => dest.DateOff, opt =>
                opt.MapFrom(src => src.dateOff))
                .ForMember(dest => dest.Reason, opt =>
                opt.MapFrom(src => src.reason))
                .ForMember(dest => dest.Create_At, opt =>
                opt.MapFrom(_ => DateTime.UtcNow));

            CreateMap<DataAccess.Entities.Application, ApplicationViewDto>()
                .ForMember(dest => dest.dateOff, opt =>
                opt.MapFrom(src => src.DateOff))
                .ForMember(dest => dest.reason, opt =>
                opt.MapFrom(src => src.Reason))
                .ForMember(dest => dest.isApproved, opt =>
                opt.MapFrom(src => src.IsApproved))
                .ForMember(dest => dest.note, opt =>
                opt.MapFrom(src => src.Note))
                .ForMember(dest => dest.createdAt, opt =>
                opt.MapFrom(src => src.Create_At));
        }
    }
}

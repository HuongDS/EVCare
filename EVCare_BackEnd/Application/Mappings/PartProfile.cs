using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Part;
using DataAccess.Entities;

namespace Application.Mappings
{
    public class PartProfile : Profile
    {
        public PartProfile()
        {
            CreateMap<PartViewModel, Part>();
            CreateMap<PartAdminUpdateModel, Part>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.ImageUrl));
                ;
            CreateMap<PartCreateModel, Part>();
            CreateMap<PartStaffUpdateModel, Part>();
        }
    }
}

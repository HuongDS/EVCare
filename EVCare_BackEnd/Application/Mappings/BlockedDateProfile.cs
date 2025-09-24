using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.BlockedDate;
using DataAccess.Entities;

namespace Application.Mappings
{
    public class BlockedDateProfile : Profile
    {
        public BlockedDateProfile() {

            CreateMap<BlockedDatePostModel, CenterUnavailableDays>()
                .ForMember(dest=>dest.CreatedAt,opt=>opt.MapFrom(src=>DateTime.Now));

        
        }
    }
}

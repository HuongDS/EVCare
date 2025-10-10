using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace Application.Mappings
{
    public class ReviewProfie : Profile
    {
        public ReviewProfie()
        {
            CreateMap<DataAccess.Dtos.Review.ReviewCreateModel, DataAccess.Entities.Review>()
                .ForMember(dest => dest.Create_At, opt => opt.MapFrom(_ => DateTime.Now));
        }
    }
}

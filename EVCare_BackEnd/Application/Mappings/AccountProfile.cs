using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using DataAccess.Dtos.Accounts;

namespace Application.Mappings
{
    public class AccountProfile : Profile
    {
        public AccountProfile() {

            CreateMap<DataAccess.Entities.Account, AccountViewModel>()
                 .ForMember(dest => dest.First_Name, opt => opt.MapFrom(src=>src.First_Name))
                .ForMember(dest => dest.Last_Name, opt => opt.MapFrom(src => src.Last_Name)); ;
        
        }
    }
}

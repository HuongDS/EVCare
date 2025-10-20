using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Part;
using DataAccess.Entities;
using DataAccess.Enums;
using DocumentFormat.OpenXml.Wordprocessing;

namespace Application.Mappings {
    public class PartHistoryProfile : Profile {
        public PartHistoryProfile() {
            CreateMap<PartCreateModel, PartHistory>()
                .ForMember(dest => dest.NewQuantity, opt => opt.MapFrom(src => src.Stock))
                .ForMember(dest => dest.ActionType, opt => opt.MapFrom(src => ActionTypeEnum.Create))
                .ForMember(dest => dest.NewUnitPrice, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.NewReplacePrice, opt => opt.MapFrom(src => src.ReplacementPrice))
                .ForMember(dest=>dest.ChangeDate,opt=>opt.MapFrom(src=>DateTime.Now))
                ;

        }
    }
}

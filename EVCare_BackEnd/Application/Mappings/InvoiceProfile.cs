using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Invoice;
using DataAccess.Entities;
using DataAccess.Enums;

namespace Application.Mappings
{
    public class InvoiceProfile : Profile
    {
        public InvoiceProfile()
        {
            CreateMap<InvoiceCreateModel, Invoice>()
            .ForMember(dest => dest.CustomerId, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => PaymentStatusEnum.Pending))
            .ForMember(dest => dest.Create_At, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.Updated_At, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}

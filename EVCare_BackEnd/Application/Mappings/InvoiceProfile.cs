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
            .ForMember(dest => dest.Create_At, opt => opt.MapFrom(src => DateTime.UtcNow.AddHours(7)))
            .ForMember(dest => dest.Updated_At, opt => opt.MapFrom(src => DateTime.UtcNow.AddHours(7)));
            CreateMap<Invoice, InvoiceViewModel>().ForMember(dest => dest.id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.appointmentDate, opt => opt.MapFrom(src => src.Order.Appointment.Appointment_Date))
                .ForMember(dest => dest.totalPrice, opt => opt.MapFrom(src => src.Total_Price))
                .ForMember(dest => dest.paymentMethod, opt => opt.MapFrom(src => src.Payment_Method))
                .ForMember(dest => dest.status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.paymentDate, opt => opt.MapFrom(src => src.Create_At));
        }
    }
}

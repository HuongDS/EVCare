using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Appointment;
using DataAccess.Entities;

namespace Application.Mappings
{
    public class AppointmentProfile : Profile
    {
        public AppointmentProfile()
        {
            CreateMap<AppointmentCreateModel, Appointment>()
            .ForMember(dest => dest.AppointmentServices, opt =>
                opt.MapFrom(src => src.ServiceIds != null
                    ? src.ServiceIds.Select(sid => new AppointmentService { ServiceId = sid })
                    : new List<AppointmentService>()))
            .ForMember(dest => dest.AppointmentImages, opt =>
                opt.MapFrom(src => src.ImagesUrls != null
                    ? src.ImagesUrls.Select(url => new Appointmentimage { Image = url })
                    : new List<Appointmentimage>()))
             .ForMember(dest => dest.Alerts, opt => opt.MapFrom(src => new List<Alert>
             {
                 new Alert
                {
                    Message=$"New appointment created for customer ID: {src.CustomerId} on {src.Appointment_Date}",
                    Create_At= DateTime.UtcNow,
                    Is_Read=false
                }
             }));
            CreateMap<AppointmentUpdateModel, Appointment>();
        }
    }
}

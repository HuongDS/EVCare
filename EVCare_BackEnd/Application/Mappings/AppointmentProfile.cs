using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Resolver;
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

            CreateMap<Appointment, AppointmentViewDto>()
                            .ForMember(dest => dest.techinicianNames, opt =>
                            opt.MapFrom<TechnicianNameResolver>())
                            .ForMember(dest => dest.services, opt =>
                            opt.MapFrom<ServiceNameResolver>())
                            .ForMember(dest => dest.appointmentID, opt =>
                            opt.MapFrom(src => src.Id))
                            .ForMember(dest => dest.appointmentDate, opt =>
                            opt.MapFrom(src => src.Appointment_Date))
                            .ForMember(dest => dest.status, opt =>
                            opt.MapFrom(src => src.Status.ToString()))
                            .ForMember(dest => dest.customerName, opt =>
                            opt.MapFrom<CustomerNameResolver>())
                            .ForMember(dest => dest.customerPhone, opt =>
                            opt.MapFrom<CustomerPhoneResolver>())
                            .ForMember(dest => dest.vehiclePlate, opt =>
                            opt.MapFrom<VehiclePlateResolver>())
                            .ForMember(dest => dest.vehicleModel, opt =>
                            opt.MapFrom<VehicleModelResolver>())
                            .ForMember(dest => dest.note, opt =>
                            opt.MapFrom(src => src.Note))
                            .ForMember(dest => dest.employeeName, opt =>
                            opt.MapFrom<EmployeeNameResolver>());
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess;
using DataAccess.Dtos.Appointment;
using DataAccess.Entities;

namespace Application.Resolver
{
    public class AppointmentImageResolver : IValueResolver<DataAccess.Entities.Appointment, DataAccess.Dtos.Appointment.AppointmentViewDto, IEnumerable<string>>
    {
        private readonly EVCareDbContext _context;
        public AppointmentImageResolver(EVCareDbContext context)
        {
            _context = context;
        }
        public IEnumerable<string> Resolve(Appointment source, AppointmentViewDto destination, IEnumerable<string> destMember, ResolutionContext context)
        {
            var images = _context.AppointmentImages
                .Where(ai => ai.AppointmentId == source.Id)
                .Select(ai => ai.Image)
                .ToList();
            return images;
        }
    }
}

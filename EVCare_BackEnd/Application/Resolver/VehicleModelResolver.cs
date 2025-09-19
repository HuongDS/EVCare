using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Appointment;
using DataAccess.Entities;
using DataAccess;

namespace Application.Resolver
{
    public class VehicleModelResolver : IValueResolver<Appointment, AppointmentViewDto, string>
    {
        private readonly EVCareDbContext _context;

        public VehicleModelResolver(EVCareDbContext context)
        {
            _context = context;
        }
        public string Resolve(Appointment source, AppointmentViewDto destination, string destMember, ResolutionContext context)
        {
            var vehicle = _context.Vehicles.FirstOrDefault(v => v.Id == source.VehicleId);
            return vehicle != null ? vehicle.Category.Name : string.Empty;
        }
    }
}

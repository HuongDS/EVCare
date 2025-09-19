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
    public class VehiclePlateResolver : IValueResolver<Appointment, AppointmentViewModel, string>
    {
        private readonly EVCareDbContext _context;

        public VehiclePlateResolver(EVCareDbContext context)
        {
            _context = context;
        }
        public string Resolve(Appointment source, AppointmentViewModel destination, string destMember, ResolutionContext context)
        {
            var vehicle = _context.Vehicles.FirstOrDefault(v => v.Id == source.VehicleId);
            return vehicle != null ? vehicle.LicensePlate : string.Empty;
        }
    }
}

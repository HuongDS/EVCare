using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Execution;
using DataAccess;
using DataAccess.Dtos.Appointment;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Resolver
{
    public class ServiceNameResolver : IValueResolver<Appointment, AppointmentViewModel, IEnumerable<string>>
    {
        private readonly EVCareDbContext _context;
        public ServiceNameResolver(EVCareDbContext context)
        {
            _context = context;
        }
        public IEnumerable<string> Resolve(Appointment source, AppointmentViewModel destination, IEnumerable<string> destMember, ResolutionContext context)
        {
            var service = _context.AppointmentServices.Include(s => s.Service)
                .Where(s => s.AppointmentId == source.Id)
                .Select(s => s.Service.Name)
                .ToList();
            return service;
        }
    }
}

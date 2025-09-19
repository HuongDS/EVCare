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
    public class TechnicianNameResolver : IValueResolver<Appointment, AppointmentViewModel, IEnumerable<string>>
    {
        private readonly EVCareDbContext _context;
        public TechnicianNameResolver(EVCareDbContext context)
        {
            _context = context;
        }

        public IEnumerable<string> Resolve(Appointment source, AppointmentViewModel destination, IEnumerable<string> destMember, ResolutionContext context)
        {
            var technicians = _context.Technicians
                .Include(t => t.Employee)
                .ThenInclude(e => e.Account)
                .Where(t => t.Id == source.Id)
                .Select(t => t.Employee.Account.First_Name + " " + t.Employee.Account.Last_Name)
                .ToList();
            return technicians;
        }
    }
}

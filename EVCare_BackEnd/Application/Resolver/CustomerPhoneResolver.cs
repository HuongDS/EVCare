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
    public class CustomerPhoneResolver : IValueResolver<Appointment, AppointmentViewDto, string>
    {
        private readonly EVCareDbContext _context;

        public CustomerPhoneResolver(EVCareDbContext context)
        {
            _context = context;
        }
        public string Resolve(Appointment source, AppointmentViewDto destination, string destMember, ResolutionContext context)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Id == source.CustomerId);
            return customer?.Account.Phone ?? string.Empty;
        }
    }
}

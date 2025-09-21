using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess;
using DataAccess.Dtos.Appointment;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Resolver
{
    public class CustomerNameResolver : IValueResolver<Appointment, AppointmentViewDto, string>
    {
        private readonly EVCareDbContext _context;

        public CustomerNameResolver(EVCareDbContext context)
        {
            _context = context;
        }

        public string Resolve(Appointment source, AppointmentViewDto destination, string destMember, ResolutionContext context)
        {
            var customer = _context.Customers.Include(c => c.Account).FirstOrDefault(c => c.Id == source.CustomerId);
            return customer.Account.First_Name + customer.Account.Last_Name;
        }
    }
}

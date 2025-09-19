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
    public class EmployeeNameResolver : IValueResolver<Appointment, AppointmentViewModel, string>
    {
        private readonly EVCareDbContext _context;

        public EmployeeNameResolver(EVCareDbContext context)
        {
            _context = context;
        }
        public string Resolve(Appointment source, AppointmentViewModel destination, string destMember, ResolutionContext context)
        {
            var employee = _context.Employees.FirstOrDefault(e => e.Id == source.EmployeeId);
            return employee != null ? employee.Account.First_Name + " " + employee.Account.Last_Name : string.Empty;
        }
    }
}

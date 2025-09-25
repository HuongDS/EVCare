using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess;
using DataAccess.Dtos.Appointment;

namespace Application.Resolver
{
    public class CustomerIdResolver : IValueResolver<AppointmentViewDetailModel, AppointmentInforToSentDto, int>
    {
        private readonly EVCareDbContext _dbContext;

        public CustomerIdResolver(EVCareDbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        public int Resolve(AppointmentViewDetailModel source, AppointmentInforToSentDto destination, int destMember, ResolutionContext context)
        {
            var customerId = _dbContext.Appointments.Select(c => c.CustomerId).ToList();
            return customerId[0];
        }
    }
}

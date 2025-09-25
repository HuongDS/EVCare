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
    public class AppointmentServiceResolver : IValueResolver<AppointmentViewDetailModel, AppointmentInforToSentDto, string>
    {
        private readonly EVCareDbContext _dbContext;

        public AppointmentServiceResolver(EVCareDbContext dbContext)
        {
            this._dbContext = dbContext;
        }
        public string Resolve(AppointmentViewDetailModel source, AppointmentInforToSentDto destination, string destMember, ResolutionContext context)
        {
            var serviceNames = _dbContext.AppointmentServices
                .Where(asv => asv.AppointmentId == source.Id)
                .Select(asv => asv.Service.Name)
                .ToList();
            return string.Join(", ", serviceNames);
        }
    }
}

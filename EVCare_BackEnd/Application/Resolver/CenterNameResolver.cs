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

namespace Application.Resolver
{
    public class CenterNameResolver : IValueResolver<AppointmentViewDetailModel, AppointmentInforToSentDto, string>
    {
        private readonly EVCareDbContext _dbContext;

        public CenterNameResolver(EVCareDbContext dbContext)
        {
            this._dbContext = dbContext;
        }
        public string Resolve(AppointmentViewDetailModel source, AppointmentInforToSentDto destination, string destMember, ResolutionContext context)
        {
            var centerName = _dbContext.ServiceCenters.Select(c => c.Name).ToList();
            return centerName[0];
        }
    }
}

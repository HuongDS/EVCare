using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Appointment;
using DataAccess;

namespace Application.Resolver
{
    public class CenterAddressResolver : IValueResolver<AppointmentViewDetailModel, AppointmentInforToSentDto, string>
    {
        private readonly EVCareDbContext _dbContext;

        public CenterAddressResolver(EVCareDbContext dbContext)
        {
            this._dbContext = dbContext;
        }
        public string Resolve(AppointmentViewDetailModel source, AppointmentInforToSentDto destination, string destMember, ResolutionContext context)
        {
            var centerAddress = _dbContext.ServiceCenters.Select(c => c.AddressName).ToList();
            return centerAddress[0];
        }
    }
}

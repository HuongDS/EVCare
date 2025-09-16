using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Interfaces;

namespace DataAccess.Repositories
{
    public class AppointmentServiceRepository : IAppointmentServiceRepository
    {
        private readonly EVCareDbContext _dbContext;
        public AppointmentServiceRepository(EVCareDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddAppointmentServicesAsync(IEnumerable<AppointmentService> appointmentServices)
        {
            await _dbContext.AppointmentServices.AddRangeAsync(appointmentServices) ;
          
        }
    }
}

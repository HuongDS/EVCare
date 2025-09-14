using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class AppointmentImageRepository : GenericRepository<Appointmentimage>, IAppointmentImageRepository
    {
        public AppointmentImageRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
    }
}

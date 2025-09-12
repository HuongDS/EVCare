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
    public class AppointmentImageRepository : GenericRepository<AppointmentImages>, IAppointmentImageRepository
    {
        public AppointmentImageRepository(EVCareDbContext dbContext, DbSet<AppointmentImages> dbSet) : base(dbContext, dbSet)
        {
        }
    }
}

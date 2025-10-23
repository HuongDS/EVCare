using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Repositories {
    public class AppointmentPartConditonRepository : IAppointmentPartConditionRepository {
        public EVCareDbContext _dbcontext;
        public AppointmentPartConditonRepository(EVCareDbContext dbcontext) {
            _dbcontext = dbcontext;
        }

    }
}

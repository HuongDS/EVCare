using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IApplicationRepository : IGenericRepository<DataAccess.Entities.Application>
    {
        Task<bool> GetApplicationByEmployeeIDAndDateOffAsync(int employeeId, DateTime dateOff);
        Task<IEnumerable<DataAccess.Entities.Application>> GetApplicationsToday();
    }
}

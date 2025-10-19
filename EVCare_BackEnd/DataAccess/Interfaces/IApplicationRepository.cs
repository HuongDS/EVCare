using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Applications;
using DataAccess.Dtos.Pagination;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IApplicationRepository : IGenericRepository<DataAccess.Entities.Application>
    {
        Task<PageResultDto<ApplicationAdminViewDto>> GetAllApplicationsAsync(ApplicationQueryDto query);
        Task<bool> GetApplicationByEmployeeIDAndDateOffAsync(int employeeId, DateTime dateOff);
        Task<PageResultDto<ApplicationViewDto>> GetApplicationByEmployeeIdAsync(ApplicationQueryDto query, int employeeId);
        Task<IEnumerable<DataAccess.Entities.Application>> GetApplicationsToday();
        Task<List<DateOnly>> GetDateoff(int employeeId);
    }
}

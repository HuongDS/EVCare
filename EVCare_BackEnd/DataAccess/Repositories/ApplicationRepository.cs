using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Applications;
using DataAccess.Dtos.Pagination;
using DataAccess.Entities;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class ApplicationRepository : GenericRepository<DataAccess.Entities.Application>, IApplicationRepository
    {
        public ApplicationRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<bool> GetApplicationByEmployeeIDAndDateOffAsync(int employeeId, DateTime dateOff)
        {
            var application = await _dbSet.FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.DateOff.Date == dateOff.Date);
            return application == null;
        }

        public async Task<PageResultDto<ApplicationViewDto>> GetApplicationByEmployeeIdAsync(ApplicationQueryDto model, int employeeId)
        {
            var query = _dbContext.Applications.AsNoTracking()
                .Where(a => a.EmployeeId == employeeId)
                .Select(a => new ApplicationViewDto
                {
                    createdAt = a.Create_At,
                    dateOff = a.DateOff,   
                    Status = a.Status,
                    note = a.Note,
                    reason = a.Reason,
                });
            if(model.Status.HasValue)
            {
                query = query.Where(a => a.Status == model.Status);
            }
            query.ApplySorting(model.SortField, model.SortOrder);
            return await PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);

        }

        public async Task<IEnumerable<DataAccess.Entities.Application>> GetApplicationsToday()
        {
            return await _dbSet
                .Where(x => DateOnly.FromDateTime(x.DateOff) == DateOnly.FromDateTime(DateTime.Now) && x.Status == Enums.ApplicationStatusEnum.Approved)
                .ToListAsync();
        }

        public async Task<List<DateOnly>> GetDateoff(int employeeId)
        {
            return await _dbContext.Applications.AsNoTracking()
                .Where(a => a.EmployeeId == employeeId && DateTime.Now<=a.DateOff)
                .Select(a => DateOnly.FromDateTime(a.DateOff))
                .ToListAsync();
        }
    }
}

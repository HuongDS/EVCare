using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Employees;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Service;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PageResultDto<EmployeeViewModel>> GetAllEmployeesAsync(EmployeeQueryDto model)
        {
            var query = _dbContext.Employees.AsNoTracking()
                .Select(static x => new EmployeeViewModel
                {
                    AccountId = x.AccountId,
                    EmployeeId = x.Id,
                    FullName = x.Account.First_Name + " " + x.Account.Last_Name,
                    Email = x.Account.Email,
                    Phone = x.Account.Phone,
                    CCCD = x.CCCD,
                    Role = x.Account.Role,
                    Status = x.Status,
                    Avatar = x.Avatar,
                    IsBanned = x.Account.Deleted_At != DateTime.MinValue,
                    TechnicianId = x.TechnicianId,
                    ExpYear = x.Technician.ExpYear,
                    Skills = x.Technician != null ? x.Technician.TechnicianSkills
                        .Select(ts => new ServiceViewFormModel
                        {
                            Id = ts.Service.Id,
                            Name = ts.Service.Name,
                        }).ToList() : new List<ServiceViewFormModel>()
                });
            if(!string.IsNullOrEmpty(model.Keyword))
            {
                var keyword = model.Keyword.Trim().ToLower();
                query = query.Where(x => x.FullName.ToLower().Contains(keyword)
                || x.Email.ToLower().Contains(keyword)
                || x.Phone.ToLower().Contains(keyword)
                || x.CCCD.ToLower().Contains(keyword));
            }
            if(model.Role != null)
            {
                query = query.Where(x => x.Role == model.Role);
            }
            if(model.Status != null)
            {
                query = query.Where(x => x.Status == model.Status);
            }
            return await PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);

        }

        public async Task<Employee> GetEmployeeByAccountId(int userId)
        {
            return await _dbContext.Employees.Include(e => e.Account).FirstOrDefaultAsync(e => e.AccountId == userId);
        }

        public async Task<Employee> GetEmployeeByTechnicianId(int technicianId)
        {
            return await _dbContext.Employees.FirstOrDefaultAsync(e => e.TechnicianId == technicianId);
        }

        public async Task MarkAvaliableAllEmployees()
        {
            await _dbContext.Employees
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.Status, x => EmployeeStatusEnum.Available));
        }

        public async Task MarkBusyForTechnician()
        {
            var activeTechnicianIds = await _dbContext.TechnicianWorkingSessions
                                       .Where(tws => tws.EndTime == null)
                                       .Select(tws => tws.TechnicianId)
                                       .Distinct()
                                       .ToListAsync();
            await _dbContext.Employees
                   .Where(e => e.Status == EmployeeStatusEnum.Available && activeTechnicianIds.Contains(e.TechnicianId.Value))
                   .ExecuteUpdateAsync(e => e.SetProperty(e => e.Status, _ => EmployeeStatusEnum.Busy));


        }

        public async Task MarkBusyForTechnician(IEnumerable<int> technicianIds)
        {
            await _dbContext.Employees.Where(x=>technicianIds.Contains(x.TechnicianId.Value))
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.Status, x => EmployeeStatusEnum.Busy));
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<Employee> GetEmployeeByAccountId(int userId)
        {
            return await _dbContext.Employees.Include(e => e.Account).FirstOrDefaultAsync(e => e.AccountId == userId);
        }

        public async Task MarkAvaliableAllEmployees()
        {
            await _dbContext.Employees
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.Status, x => EmployeeStatusEnum.Available));
        }

        public async Task MarkBusyForTechnician()
        {
            await _dbContext.Employees
                .Where(x=> x.Status !=EmployeeStatusEnum.OnLeave && 
                x.Technician!=null && x.Technician.TechnicianWorkingSessions.Any(x=>x.EndTime!=null))
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.Status, x => EmployeeStatusEnum.Busy));


        }

        public async Task MarkBusyForTechnician(IEnumerable<int> technicianIds)
        {
            await _dbContext.Employees.Where(x=>technicianIds.Contains(x.TechnicianId.Value))
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.Status, x => EmployeeStatusEnum.Busy));
        }
    }
}

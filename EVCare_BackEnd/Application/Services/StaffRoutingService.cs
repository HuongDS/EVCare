using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess;
using DataAccess.Enums;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

namespace Application.Services
{
    public class StaffRoutingService : IStaffRoutingService
    {
        private readonly EVCareDbContext _dbContext;

        public StaffRoutingService(EVCareDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<int> FindAvailableAsync()
        {
            var candidate = await _dbContext.Accounts
                .Include(a => a.Employee)
                .Where(a => a.Role == RoleEnum.Staff && a.Deleted_At == DateTime.MinValue && a.Employee.Status == EmployeeStatusEnum.Available)
                .FirstOrDefaultAsync();

            if (candidate is null) throw new Exception(Message.NOT_FOUND_STAFF_SASTISFY);

            return candidate.Id;
        }
    }
}

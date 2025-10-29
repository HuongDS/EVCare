using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess;
using DataAccess.Dtos.MongoDb_Message;
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
        public async Task<string> FindAvailableAsync(string customerAccountId)
        {
            var appointment = await _dbContext.Appointments.FirstOrDefaultAsync(a => a.CustomerId.ToString() == customerAccountId);
            if (appointment is null) throw new Exception(Application.Infrastructures.Message.APPOINTMENT_NOT_FOUND);

            var candidate = await _dbContext.Employees.FirstOrDefaultAsync(a => a.Id == appointment.EmployeeId);
            if (candidate is null) throw new Exception(Application.Infrastructures.Message.NOT_FOUND_STAFF_SASTISFY);

            return candidate.Id.ToString();
        }
    }
}

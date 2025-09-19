using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Helpers;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Appointment;

namespace DataAccess.Repositories
{
    public class AppointmentRepository : GenericRepository<Appointment>, IAppointmentRepository
    {
        public AppointmentRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task UpdateAppointmentStatusAsync(int appointmentID, AppointmentStatusEnum status)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(e => e.Id == appointmentID);
            if (entity is null)
            {
                throw new Exception($"Entity with id = {appointmentID} is not found.");
            }
            entity.Status = status;
            _dbContext.Update(entity);
            await _dbContext.SaveChangesAsync();
        }
        public async Task<(IEnumerable<Appointment>, int, int)> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, DateOnly currentDate, int pageSize, int pageIndex)
        {
            var startDate = currentDate.ToDateTime(TimeOnly.MinValue);
            var endDate = currentDate.ToDateTime(TimeOnly.MaxValue);
            var appointments = _dbSet.Where(a => a.EmployeeId == employeeID && a.Status == status && a.Appointment_Date >= startDate && a.Appointment_Date <= endDate).AsQueryable();
            return await PaginationHelper.PaginationAsync(appointments, pageSize, pageIndex);
        }
        public async Task<(IEnumerable<Appointment>, int, int)> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, int pageSize, int pageIndex)
        {
            var appointments = _dbSet.Where(a => a.EmployeeId == employeeID && a.Status == status).AsQueryable();
            return await PaginationHelper.PaginationAsync(appointments, pageSize, pageIndex);
        }
    }
}

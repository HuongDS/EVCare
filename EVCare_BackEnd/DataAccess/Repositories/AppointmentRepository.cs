using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Helpers;
using DataAccess.Dtos.Appointment;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;
using DataAccess.Dtos.CenterCare;

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

        public async Task<int> CountAppointmentsPerDay(int customerId)
        {
            var today = DateTime.Today;         
            var tomorrow = today.AddDays(1);

            return await _dbSet.CountAsync(x =>
                x.CustomerId == customerId
                && x.Create_At >= today
                && x.Create_At < tomorrow
            );


        }

        public async Task<int> CountAppointmnetToday()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            return await _dbSet.CountAsync(x =>
   
                x.Create_At >= today
                && x.Create_At < tomorrow
                );
        }

        public async Task<IEnumerable<AppointmentViewModel>> GetAppointmentsByCustomerId(int customerId)
        {

            return await _dbContext.Appointments.Where(a => a.CustomerId == customerId)
                .Include(a => a.Vehicle).ThenInclude(v => v.Category)
                .Include(a => a.AppointmentServices).ThenInclude(asv => asv.Service)
                .Select(a => new AppointmentViewModel
                {
                    Id = a.Id,
                    AppointmentDate = a.Appointment_Date,
                    Services = a.AppointmentServices.Select(s => s.Service.Name).ToList(),
                    Status = a.Status,
                    VehicleName = a.Vehicle.Category.Name,
                    VehicleImageUrl = a.Vehicle.Image
                }).ToListAsync();

        }

        public async Task<IEnumerable<AppointmentViewModel>> GetAppointmentsWithPagination(int payload, int pageindex)
        {
            return await _dbContext.Appointments.Include(a => a.Vehicle).ThenInclude(v => v.Category)
                .Include(a => a.AppointmentServices).ThenInclude(asv => asv.Service)
                .OrderBy(a => a.Id)
                .Skip((pageindex - 1) * payload)
                .Take(payload)
                .Select(a => new AppointmentViewModel
                {
                    Id = a.Id,
                    AppointmentDate = a.Appointment_Date,
                    Services = a.AppointmentServices.Select(s => s.Service.Name).ToList(),
                    Status = a.Status,
                    VehicleName = a.Vehicle.Category.Name,
                    VehicleImageUrl = a.Vehicle.Image
                }).ToListAsync();

        }

        public async Task<AppointmentViewDetailModel> GetAppointmentWithDetails(int appointmentId)
        {
            return await _dbContext.Appointments
                .Where(a => a.Id == appointmentId)
                .Include(a => a.Vehicle).ThenInclude(v => v.Category)
                .Include(a => a.Customer).ThenInclude(c => c.Account)
                .Include(a => a.Employee).ThenInclude(e => e.Account)
                .Include(a => a.AppointmentImages)
                .Include(a => a.AppointmentServices).ThenInclude(asv => asv.Service)
                .Select(a => new AppointmentViewDetailModel
                {
                    Id = a.Id,
                    AppointmentDate = a.Appointment_Date,
                    Note = a.Note,
                    Status = a.Status,
                    VehicleName = a.Vehicle.Category.Name,
                    VehiclePlateNumber = a.Vehicle.LicensePlate,
                    CustomerName = a.Customer.Account.First_Name + " " + a.Customer.Account.Last_Name,
                    CustomerEmail = a.Customer.Account.Email,
                    CustomerPhone = a.Customer.Account.Phone,
                    EmployeeName = a.Employee != null
                        ? a.Employee.Account.First_Name + " " + a.Employee.Account.Last_Name
                        : null,
                    OrderId = a.OrderId,
                    Services = a.AppointmentServices.Select(s => s.Service.Name).ToList(),
                    ImagesUrls = a.AppointmentImages.Select(img => img.Image).ToList()
                })
                .FirstOrDefaultAsync();
        }
        public async Task<int> GetCurrentSlotAsync()
        {
            var currSlot = await _dbSet.CountAsync(a => a.Status == AppointmentStatusEnum.InProgress);
            return currSlot;
        }
        public async Task<(IEnumerable<Appointment>, int, int)> GetAppointmentInDayWithPaginationAsync(DateTime date, int pageSize, int pageIndex)
        {
            var query = _dbContext.Appointments.Where(a => a.Appointment_Date.Date == date.Date && a.Status == AppointmentStatusEnum.Confirmed).AsQueryable();
            var (list, totalItems, totalPages) = await PaginationHelper.PaginationAsync(query, pageSize, pageIndex);
            return (list, totalItems, totalPages);
        }
        public async Task<Appointment> GetAppointmentByOrderIdAsync(int orderId)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(a => a.OrderId == orderId);
            if (entity is null)
            {
                throw new Exception($"Entity with orderId = {orderId} is not found.");
            }
            return entity;
        }
        public async Task<(IEnumerable<Appointment>, int, int)> GetAppointmentBeforeDayAsync(DateTime date, int pageSize, int pageIndex)
        {
            var entity = _dbSet.Where(a => a.Appointment_Date.Date <= date.Date && a.Status == AppointmentStatusEnum.Confirmed).OrderBy(a => a.Appointment_Date).AsQueryable();
            var (list, totalItems, totalPages) = await PaginationHelper.PaginationAsync(entity, pageSize, pageIndex);
            return (list, totalItems, totalPages);
        }
        public async Task<Appointment> UpdateAppointmentDate(DateTime date, int appointmentId)
        {
            var appointment = await _dbSet.FirstOrDefaultAsync(a => a.Id == appointmentId);
            if (appointment == null)
            {
                throw new Exception($"Appointment with id = {appointmentId} is not found.");
            }
            appointment.Appointment_Date = date;
            _dbContext.Update(appointment);
            await _dbContext.SaveChangesAsync();
            return appointment;
        }

        public async Task<CenterDailyCapacityModel> GetAppointmentWithDailyCount(int days, DateOnly today)
        {
            var center = await _dbContext.ServiceCenters.FirstOrDefaultAsync();
            var capacity = center.Capacity;
            var start = today.ToDateTime(TimeOnly.MinValue);
            var end = today.AddDays(days).ToDateTime(TimeOnly.MinValue);

            var grouped = await _dbContext.Appointments.AsNoTracking()
                .Where(a => a.Appointment_Date >= start && a.Appointment_Date < end)
                .GroupBy(a => DateOnly.FromDateTime(a.Appointment_Date)).
                 Select(g => new AppointmentDailyCountModel
                 {
                     Count = g.Count(),
                     Date = g.Key

                 }).ToListAsync();
            var map = grouped.ToDictionary(x => x.Date, x => x.Count);
            var filled = Enumerable.Range(0, days)
                .Select(day => today.AddDays(day))
                .Select(d => new AppointmentDailyCountModel
                {
                    Date = d,
                    Count = map.TryGetValue(d, out var count) ? count : 0
                }).ToList();


            return new CenterDailyCapacityModel
            {
                Capacity = capacity,
                AppointmentDailyCountModels = filled
            };

        }

        public async Task CancelAppointment()
        {
            var today = DateOnly.FromDateTime(DateTime.Now);
            await _dbContext.Appointments
                .Where(a => DateOnly.FromDateTime(a.Appointment_Date) < today && a.Status== AppointmentStatusEnum.Pending)
                .ExecuteUpdateAsync(s => s
                .SetProperty(x=>x.Status,AppointmentStatusEnum.Canceled)   
                );

        }
    }
}

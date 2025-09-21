using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Appointment;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class AppointmentRepository : GenericRepository<Appointment>, IAppointmentRepository
    {
        public AppointmentRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<int> CountAppointmentsPerDay(int customerId)
        {
            var today = DateTime.Now;
            return await _dbSet.CountAsync(x=>x.CustomerId == customerId && x.Create_At == today); 
            

        }

        public async Task<int> CountAppointmnetToday()
        {
            var today = DateTime.Now;
            return await _dbSet.CountAsync(x => x.Create_At == today);
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


    }
}

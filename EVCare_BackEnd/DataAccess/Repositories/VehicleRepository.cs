using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Vehicle;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class VehicleRepository : GenericRepository<Vehicle>, IVehicleRepository
    {
        public VehicleRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<bool> CheckLicensePlate(string licensePlate)
        {
            return await _dbSet.AnyAsync(x=>x.LicensePlate == licensePlate);
        }

        public async Task<int> GetCustomerIdByVehicleId(int vehicleId)
        {
            return await _dbContext.Vehicles.Where(v => v.Id == vehicleId)
                .Select(v => v.CustomerId)
                .FirstOrDefaultAsync();
        }

        public async Task<VehicleDetailViewModel> GetVehicleDetailById(int vehicleId)
        {
            return await _dbContext.Vehicles
                .Where(v => v.Id == vehicleId)
                .Include(v=>v.Category)
                .Select(x=>new VehicleDetailViewModel
                {
                    Id = x.Id,
                    Image = x.Image,
                    LicensePlate = x.LicensePlate,
                    CategoryName = x.Category.Name,
                    Last_Appointment = x.Last_Appointment,
                    Last_Kilometer = x.Last_Kilometer
                })
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<VehicleReminderDto>> GetVehicleReminderTodayAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.Now);
            var serviceCenter = await _dbContext.ServiceCenters.FirstOrDefaultAsync();
            return await _dbContext.Vehicles.AsNoTracking()
                .Include(x => x.Customer)
                .Include(x=>x.Customer.Account)
                .Where(x => x.NextServiceDate.HasValue
                              && DateOnly.FromDateTime(x.NextServiceDate.Value) <= today)
                .Select(x => new VehicleReminderDto
                {
                    Id = x.Id,
                    CustomerName = x.Customer.Account.First_Name+" " +x.Customer.Account.Last_Name,
                    Email = x.Customer.Account.Email,
                    HotLine = serviceCenter.Hotline,
                    LicensePlate = x.LicensePlate,
                    ServiceCenterName = serviceCenter.Name

                }).ToListAsync();
                
        }

        public async Task<IEnumerable<Vehicle>> GetVehiclesByCustomerId(int customerId)
        {
            return await _dbSet.Where(x=>x.CustomerId==customerId).Include(x=>x.Category).ToListAsync();
                
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Vehicle;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IVehicleRepository : IGenericRepository<Vehicle>
    {
        Task<int> GetCustomerIdByVehicleId(int vehicleId);
        Task<VehicleDetailViewModel> GetVehicleDetailById(int vehicleId);
        Task<IEnumerable<Vehicle>> GetVehiclesByCustomerId(int customerId);
        Task<IEnumerable<VehicleReminderDto>> GetVehicleReminderTodayAsync();
        
    }
}

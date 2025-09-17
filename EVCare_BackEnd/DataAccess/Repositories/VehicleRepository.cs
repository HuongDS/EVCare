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

        public async Task<int> GetCustomerIdByVehicleId(int vehicleId)
        {
            return await _dbContext.Vehicles.Where(v => v.Id == vehicleId)
                .Select(v => v.CustomerId)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Vehicle>> GetVehiclesByCustomerId(int customerId)
        {
            return await _dbSet.Where(x=>x.CustomerId==customerId).ToListAsync();
                
        }
    }
}

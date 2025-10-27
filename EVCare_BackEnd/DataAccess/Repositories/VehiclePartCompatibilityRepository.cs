using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories {
    public class VehiclePartCompatibilityRepository : IVehiclePartCompatibilityRepository {
        private readonly EVCareDbContext _dbContext;
        public VehiclePartCompatibilityRepository(EVCareDbContext dbContext) {
            _dbContext = dbContext;
        }
        public async Task AddRangeAsync(IEnumerable<VehiclePartCompatibility> enumerable) {
            await _dbContext.AddRangeAsync(enumerable);
        }

        public async Task DeleteAsyncByPartCategoryId(int id) {
            await _dbContext.VehiclePartCompatibilities.Where(vpc => vpc.VehicleCategoryId == id)
                .ExecuteDeleteAsync();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class VehicleCategoryRepository : GenericRepository<VehiclesCategory>, IVehicleCategoryRepository
    {
        public VehicleCategoryRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<IEnumerable<VehiclesCategory>> GetActiveCategoriesAsync()
        {
            return  await _dbSet.Where(vc=>vc.Deleted_At==DateTime.MinValue).AsNoTracking().ToListAsync();
        }
    }
    
    
}

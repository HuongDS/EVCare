using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.VehicleCategory;
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

        public async Task<VehicleCategoryViewPartModel> GetCategoryDetailAsync(int id) {
            return await _dbSet
                 .AsNoTracking()
                 .Where(vc=>vc.Deleted_At==DateTime.MinValue)
                .Include(vc => vc.VehiclePartCompatibilities)
                .Select(vc => new VehicleCategoryViewPartModel
                {
                    Id = vc.Id,
                    Name = vc.Name,
                    Model3DUrl = vc.Model3DUrl,
                    PartCategoryNames = vc.VehiclePartCompatibilities.Select(vpc => new DataAccess.Dtos.PartCategory.PartCategoryViewFormModel
                    {
                        Id = vpc.PartCategory.Id,
                        Name = vpc.PartCategory.Name
                    }).ToList()
                })
                .FirstOrDefaultAsync(vc => vc.Id == id);       
        }
    }
    
    
}

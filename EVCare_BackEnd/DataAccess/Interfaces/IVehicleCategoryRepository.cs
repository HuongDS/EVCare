using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.VehicleCategory;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IVehicleCategoryRepository : IGenericRepository<VehiclesCategory>
    {
        Task<IEnumerable<VehiclesCategory>> GetActiveCategoriesAsync();
        Task<VehicleCategoryViewPartModel> GetCategoryDetailAsync(int id);
    }
}

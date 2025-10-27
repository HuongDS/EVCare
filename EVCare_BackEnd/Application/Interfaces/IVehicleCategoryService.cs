using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.VehicleCategory;

namespace Application.Interfaces
{
    public interface IVehicleCategoryService
    {
        Task<int> CreateCategoryAsync(VehicleCategoryCreateModel model);
        Task<IEnumerable<VehicleCategoryViewModel>> GetAllActiveCategoriesAsync();
        Task<VehicleCategoryViewPartModel> GetCategoryDetailAsync(int id);
        Task UpdateCategoryAsync(int id, VehicleCategoryCreateModel model);
    }
}

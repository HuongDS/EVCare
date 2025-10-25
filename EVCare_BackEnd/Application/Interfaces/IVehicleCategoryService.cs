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
        Task<IEnumerable<VehicleCategoryViewModel>> GetAllActiveCategoriesAsync();
        Task<VehicleCategoryViewPartModel> GetCategoryDetailAsync(int id);
    }
}

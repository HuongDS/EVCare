using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.VehicleCategory;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class VehicleCategoryService : IVehicleCategoryService
    {
        private readonly IVehicleCategoryRepository _vehicleCategoryRepository;
        private readonly IMapper _mapper;
        public VehicleCategoryService(IVehicleCategoryRepository vehicleCategoryRepository,IMapper mapper)
        {
            _vehicleCategoryRepository = vehicleCategoryRepository;
            _mapper = mapper;
        }
        public async Task<IEnumerable<VehicleCategoryViewModel>> GetAllActiveCategoriesAsync()
        {
            var categories = await _vehicleCategoryRepository.GetActiveCategoriesAsync();
            return _mapper.Map<IEnumerable<VehicleCategoryViewModel>>(categories);

        }

        public async Task<VehicleCategoryViewPartModel> GetCategoryDetailAsync(int id) {

            var vehicle = await _vehicleCategoryRepository.GetByIdAsync(id);
            if (vehicle == null || vehicle.Deleted_At != DateTime.MinValue)
            {
                throw new Exception("Vehicle category not found");
            }

            return await _vehicleCategoryRepository.GetCategoryDetailAsync(id);
        }
    }
}

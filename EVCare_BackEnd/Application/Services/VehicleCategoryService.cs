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

        public Task<VehicleCategoryViewPartModel> GetCategoryDetailAsync(int id) {
            throw new NotImplementedException();
        }
    }
}

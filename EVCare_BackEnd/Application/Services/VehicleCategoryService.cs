using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.VehicleCategory;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class VehicleCategoryService : IVehicleCategoryService
    {
        private readonly IVehicleCategoryRepository _vehicleCategoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVehiclePartCompatibilityRepository _vehiclePartCompatibilityRepository;
        private readonly IMapper _mapper;
        public VehicleCategoryService(IVehicleCategoryRepository vehicleCategoryRepository
            ,IUnitOfWork unitOfWork
            ,IVehiclePartCompatibilityRepository vehiclePartCompatibilityRepository
            ,IMapper mapper)
        {
            _vehicleCategoryRepository = vehicleCategoryRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _vehiclePartCompatibilityRepository = vehiclePartCompatibilityRepository;
        }

        public async Task<int> CreateCategoryAsync(VehicleCategoryCreateModel model) {

            var id = 0;
            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                var categoryEntity = _mapper.Map<DataAccess.Entities.VehiclesCategory>(model);
                
                var createdCategory = await _vehicleCategoryRepository.AddAsync(categoryEntity);
                if (model.PartCategoryIds != null && model.PartCategoryIds.Length > 0)
                {
                   await  _vehiclePartCompatibilityRepository.AddRangeAsync(model.PartCategoryIds.Select(partCategoryId => new DataAccess.Entities.VehiclePartCompatibility
                    {
                        Vehicle = createdCategory,
                        PartCategoryId = partCategoryId
                    }));
                }
            });

            return id;
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

        public async Task UpdateCategoryAsync(int id, VehicleCategoryCreateModel model) {
            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                var category = await _vehicleCategoryRepository.GetByIdAsync(id);
                if (category == null || category.Deleted_At != DateTime.MinValue)
                {
                    throw new Exception("Vehicle category not found");
                }
                _mapper.Map(model, category);
                await _vehiclePartCompatibilityRepository.DeleteAsyncByPartCategoryId(id);
                if (model.PartCategoryIds != null && model.PartCategoryIds.Length > 0)
                {
                    await _vehiclePartCompatibilityRepository.AddRangeAsync(model.PartCategoryIds.Select(partCategoryId => new DataAccess.Entities.VehiclePartCompatibility
                    {
                        Vehicle = category,
                        PartCategoryId = partCategoryId
                    }));
                }


            });
        }
    }
}

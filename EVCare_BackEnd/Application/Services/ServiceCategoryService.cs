using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.ServiceCategory;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class ServiceCategoryService : IServiceCategoryService
    {
        private readonly IServiceCategoryRepository _serviceCategoryRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IServiceRepository _serviceRepository;
        public ServiceCategoryService(IServiceCategoryRepository serviceCategoryRepository,IMapper mapper
            ,IServiceRepository serviceRepository,IUnitOfWork unitOfWork

            )
        {
            _serviceCategoryRepository = serviceCategoryRepository;
            _mapper = mapper;
            _serviceRepository = serviceRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<int> CreateServiceCategoryAsync(ServiceCategoryCreateModel model) {
            var entity = _mapper.Map<DataAccess.Entities.ServiceCategory>(model);
            return (await _serviceCategoryRepository.AddAsync(entity)).Id;

        }

        public async Task DeleteServiceCategoryAsync(int id) {
         
             await _unitOfWork.ExecuteInTransactionAsync(async () =>
             {
                 var serviceCategory = await _serviceCategoryRepository.GetByIdAsync(id);
                 if (serviceCategory == null) throw new Exception("Service Category not found");
                 
                 await _serviceRepository.DeleteByServiceCategoryIdAsync(id);
                 serviceCategory.Deleted_At = DateTime.UtcNow;
                 await _serviceCategoryRepository.UpdateAsync(serviceCategory);

             });
        }

        public async Task<IEnumerable<ServiceCategoryViewModel>> GetServiceCategoryAndService()
        {
             return await _serviceCategoryRepository.GetServiceCategoryAndService();
        }

        public async Task<PageResultDto<ServiceCategoryViewDto>> GetSrvicecategoryViewDto(ServiceCategoryQueryDto model) {
            return await _serviceCategoryRepository.GetSrvicecategoryViewDto(model);
        }

        public async Task UpdateServiceCategoryAsync(int id, ServiceCategoryCreateModel model) {
            var enity = await _serviceCategoryRepository.GetByIdAsync(id);
            _mapper.Map(model, enity);
            await _serviceCategoryRepository.UpdateAsync(enity);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.IService;
using AutoMapper;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Service;
using DataAccess.Interfaces;

namespace Application.Service
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IServiceCategoryRepository _serviceCategoryRepository;
        private readonly IPartRepository _partRepository;
        private readonly IMapper _mapper;
        private readonly IServicePartRepository _servicePartRepository;
        public ServiceService(IServiceRepository serviceRepository, IMapper mapper,IServiceCategoryRepository serviceCategoryRepository, IPartRepository partRepository, IServicePartRepository servicePartRepository)
        {
            _serviceRepository = serviceRepository;
            _mapper = mapper;
            _serviceCategoryRepository = serviceCategoryRepository;
            _partRepository = partRepository;
            _servicePartRepository = servicePartRepository;

        }

        public async Task<int> AddAService(ServicePostModel model)
        {

            var category = await _serviceCategoryRepository.GetByIdAsync(model.ServiceCategoryId);

            if (category == null)
            {
                throw new Exception("Service Category not found");
            }
            if(category.Deleted_At!=DateTime.MinValue)
            {
                throw new Exception("Service Category is inactive");
            }

            foreach(var partId in model.PartsIds)
            {
                var part = await _partRepository.GetByIdAsync(partId);
                if(part == null)
                {
                    throw new Exception($"Part with id {partId} not found");
                }
                if(part.Deleted_At != DateTime.MinValue)
                {
                    throw new Exception($"Part with id {partId} is inactive");
                }
            }
        
            var data = _mapper.Map<DataAccess.Entities.Service>(model);
            var entity = await _serviceRepository.AddAsync(data);
            await _servicePartRepository.AddRangeAsync(entity.Id, model.PartsIds);
            return entity.Id;
        }

      

        public async Task<PageResultDto<ServiceViewModel>> GetActiveServicesWithPaginationAsync(ServiceQueryDto model)
        {
            return await _serviceRepository.GetActiveServiceAndKeywordWithPagination(model);
           
        }

        public async Task<IEnumerable<ServiceViewModel>> GetAllActiveServicesAsync(string keyword)
        {
            var services =  await _serviceRepository.GetAllActiveServices(keyword);
            return _mapper.Map<IEnumerable<ServiceViewModel>>(services);
        }

        public async Task<IEnumerable<ServiceViewModel>> GetAllServicesAsync()
        {
            var services = await _serviceRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ServiceViewModel>>(services);

        }

        public async Task<PageResultDto<ServiceViewDetailModel>> GetServicesWithPaginationAsync(ServiceQueryDto model)
        {
            return await _serviceRepository.GetServiceAndKeywordWithPagination(model);
            
        }

        public async Task DeleteAService(int serviceId)
        {
               var service = await _serviceRepository.GetByIdAsync(serviceId);
                  if (service == null) {
                    throw new Exception("Service not found");
                }
                service.Deleted_At = DateTime.UtcNow;
                await _serviceRepository.UpdateAsync(service);

        }

        public async Task<DataAccess.Entities.Service> UpdateAService(ServicePutModel model)
        {
            var category = await _serviceCategoryRepository.GetByIdAsync(model.ServiceCategoryId);

            if (category == null) {
                throw new Exception("Service Category not found");
            }
            if (category.Deleted_At != DateTime.MinValue) {
                throw new Exception("Service Category is inactive");
            }
            var entity = await _serviceRepository.GetByIdAsync(model.Id);
            if (entity == null)
            {
                throw new Exception("Source not found");
            }
            foreach (var partId in model.PartsIds) {
                var part = await _partRepository.GetByIdAsync(partId);
                if (part == null) {
                    throw new Exception($"Part with id {partId} not found");
                }
                if (part.Deleted_At != DateTime.MinValue) {
                    throw new Exception($"Part with id {partId} is inactive");
                }
            }
            await _servicePartRepository.DeleteByServiceIdAsync(model.Id);
            await _servicePartRepository.AddRangeAsync(model.Id, model.PartsIds);

            _mapper.Map(model, entity);
            return await _serviceRepository.UpdateAsync(entity);
        }
    }
}

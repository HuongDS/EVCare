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
        private readonly IMapper _mapper;
        public ServiceService(IServiceRepository serviceRepository, IMapper mapper)
        {
            _serviceRepository = serviceRepository;
            _mapper = mapper;
          
        }

        public async Task<int> AddAService(ServicePostModel model)
        {
            var data = _mapper.Map<DataAccess.Entities.Service>(model);

            var entity = await _serviceRepository.AddAsync(data);
            return entity.Id;
        }

      

        public async Task<PageResultDto<ServiceViewModel>> GetActiveServicesWithPaginationAsync(string k, int payload,int pageIndex)
        {
            return await _serviceRepository.GetActiveServiceAndKeywordWithPagination(k,payload,pageIndex);
           
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

        public async Task<PageResultDto<ServiceViewModel>> GetServicesWithPaginationAsync(string keyword, int payload, int payindex)
        {
            return await _serviceRepository.GetServiceAndKeywordWithPagination(keyword,payload, payindex);
            
        }

        public async Task DeleteAService(int serviceId)
        {
            try
            {
                await _serviceRepository.DeleteAsync(serviceId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            
        }

        public async Task<DataAccess.Entities.Service> UpdateAService(ServicePutModel model)
        {
            var entity = await _serviceRepository.GetByIdAsync(model.Id);
            if (entity == null)
            {
                throw new Exception("Source not found");
            }
            _mapper.Map(model, entity);
            return await _serviceRepository.UpdateAsync(entity);
        }
    }
}

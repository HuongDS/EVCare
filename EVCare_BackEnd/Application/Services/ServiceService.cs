using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.IService;
using AutoMapper;
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

        public async Task<IEnumerable<ServiceViewModel>> GetActiveServicesWithPaginationAsync(int payload,int pageIndex)
        {
            var services =  await _serviceRepository.GetActiveServiceWithPagination(payload,pageIndex);
            return _mapper.Map<IEnumerable<ServiceViewModel>>(services);
        }

        public async Task<IEnumerable<ServiceViewModel>> GetAllActiveServicesAsync()
        {
            var services =  await _serviceRepository.GetAllActiveServices();
            return _mapper.Map<IEnumerable<ServiceViewModel>>(services);
        }

        public async Task<IEnumerable<ServiceViewModel>> GetAllServicesAsync()
        {
            var services = await _serviceRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ServiceViewModel>>(services);

        }

        public async Task<IEnumerable<ServiceViewModel>> GetServicesWithPaginationAsync(int payload, int payindex)
        {
            var services =  await _serviceRepository.GetWithPaginationAsync(payload, payindex);
            return _mapper.Map<IEnumerable<ServiceViewModel>>(services);
        }
    }
}

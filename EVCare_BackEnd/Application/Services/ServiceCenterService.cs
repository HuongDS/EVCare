using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Others;
using DataAccess.Dtos.ServiceCenter;
using DataAccess.Interfaces;
using DataAccess.Repositories;

namespace Application.Services
{
    public class ServiceCenterService : IServiceCenterService
    {
        private readonly IServiceCenterRepository _serviceCenterRepository;
        private readonly IMapper _mapper;

        public ServiceCenterService(IServiceCenterRepository serviceCenterRepository, IMapper mapper)
        {
            _serviceCenterRepository = serviceCenterRepository;
            _mapper = mapper;
        }
        public async Task<ServiceCenterViewDto> GetCenterInformationAsync()
        {
            var center = await _serviceCenterRepository.GetCenterInforAsync();
            return _mapper.Map<ServiceCenterViewDto>(center);
        }

        public async Task<ServiceCenterViewModel> GetServiceCenterInformationAsync()
        {
            var center = await _serviceCenterRepository.GetCenterInforAsync();
            return _mapper.Map<ServiceCenterViewModel>(center);
        }

        public async Task UpdateServiceCenterAsync(ServiceCenterViewModel model)
        {
            var entities = await _serviceCenterRepository.GetAllAsync();
            var entity = entities.FirstOrDefault();
            _mapper.Map(model, entity);
            await _serviceCenterRepository.UpdateAsync(entity);
                 
        }
    }
}

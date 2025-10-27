using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.ServiceCategory;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class ServiceCategoryService : IServiceCategoryService
    {
        private readonly IServiceCategoryRepository _serviceCategoryRepository;
        public ServiceCategoryService(IServiceCategoryRepository serviceCategoryRepository)
        {
            _serviceCategoryRepository = serviceCategoryRepository;
        }
        public async Task<IEnumerable<ServiceCategoryViewModel>> GetServiceCategoryAndService()
        {
             return await _serviceCategoryRepository.GetServiceCategoryAndService();
        }

        public async Task<PageResultDto<ServiceCategoryViewDto>> GetSrvicecategoryViewDto(ServiceCategoryQueryDto model) {
            return await _serviceCategoryRepository.GetSrvicecategoryViewDto(model);
        }
    }
}

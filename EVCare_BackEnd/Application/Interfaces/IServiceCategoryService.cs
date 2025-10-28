using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.ServiceCategory;

namespace Application.Interfaces
{
    public interface IServiceCategoryService
    {
        Task<int> CreateServiceCategoryAsync(ServiceCategoryCreateModel model);
        Task DeleteServiceCategoryAsync(int id);
        public Task<IEnumerable<ServiceCategoryViewModel>> GetServiceCategoryAndService();
        Task<PageResultDto<ServiceCategoryViewDto>> GetSrvicecategoryViewDto(ServiceCategoryQueryDto model);
        Task UpdateServiceCategoryAsync(int id, ServiceCategoryCreateModel model);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.ServiceCategory;

namespace DataAccess.Interfaces
{
    public interface IServiceCategoryRepository : IGenericRepository<DataAccess.Entities.ServiceCategory> {
        public Task<IEnumerable<ServiceCategoryViewModel>> GetServiceCategoryAndService();
        Task<PageResultDto<ServiceCategoryViewDto>> GetSrvicecategoryViewDto(ServiceCategoryQueryDto model);
    }
}

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Service;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IServiceRepository : IGenericRepository<Service>
    {
    
        Task<PageResultDto<ServiceViewModel>> GetActiveServiceAndKeywordWithPagination(ServiceQueryDto model);
        Task<PageResultDto<ServiceViewDetailModel>> GetServiceAndKeywordWithPagination(ServiceQueryDto model);
        Task <IEnumerable<Service>> GetAllActiveServices(string keyword);
        Task DeleteByServiceCategoryIdAsync(int id);
    }
}

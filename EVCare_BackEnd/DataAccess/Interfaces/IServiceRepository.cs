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
    
        Task<PageResultDto<ServiceViewModel>> GetActiveServiceAndKeywordWithPagination(string keyword,int payload, int pageIndex);
        Task<PageResultDto<ServiceViewModel>> GetServiceAndKeywordWithPagination(string keyword, int payload, int pageIndex);
        Task <IEnumerable<Service>> GetAllActiveServices(string keyword);
    }
}

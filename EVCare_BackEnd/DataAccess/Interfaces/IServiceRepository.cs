using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IServiceRepository : IGenericRepository<Service>
    {
        Task<IEnumerable> GetServiceWithCategoryIdAndPagination(int catgoryId, int payload, int pageIndex);
        Task<IEnumerable<Service>> GetActiveServiceWithPagination(int payload, int pageIndex);
        Task <IEnumerable<Service>> GetAllActiveServices();
    }
}

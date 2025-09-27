using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Service;

namespace Application.IService
{
    public interface IServiceService
    {   
        Task<IEnumerable<ServiceViewModel>> GetAllActiveServicesAsync(string keyword);
        Task <PageResultDto<ServiceViewModel>> GetActiveServicesWithPaginationAsync(string keyword,int payload,int pageIndex);
        Task<IEnumerable<ServiceViewModel>> GetAllServicesAsync();
        //Task<ServiceDto> GetServiceByIdAsync(int id);
        Task<PageResultDto<ServiceViewModel>> GetServicesWithPaginationAsync(string keyword,int payload, int payindex);
        Task<int> AddAService(ServicePostModel model);
        object DeleteAService(int serviceId);
        //Task<ServiceDto> AddServiceAsync(CreateServiceDto createServiceDto);
        //Task<ServiceDto> UpdateServiceAsync(int id, UpdateServiceDto updateServiceDto);
        //Task DeleteServiceAsync(int id);
    }
}

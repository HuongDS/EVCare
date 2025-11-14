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
       
        Task <PageResultDto<ServiceViewModel>> GetActiveServicesWithPaginationAsync(ServiceQueryDto model);
        Task<IEnumerable<ServiceViewModel>> GetAllServicesAsync();
        //Task<ServiceDto> GetServiceByIdAsync(int id);
        Task<PageResultDto<ServiceViewDetailModel>> GetServicesWithPaginationAsync(ServiceQueryDto model);
        Task<int> AddAService(ServicePostModel model);
        Task DeleteAService(int serviceId);
        Task<DataAccess.Entities.Service> UpdateAService(ServicePutModel model);
        //Task<ServiceDto> AddServiceAsync(CreateServiceDto createServiceDto);
        //Task<ServiceDto> UpdateServiceAsync(int id, UpdateServiceDto updateServiceDto);
        //Task DeleteServiceAsync(int id);
    }
}

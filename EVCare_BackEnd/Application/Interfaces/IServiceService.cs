using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;

namespace Application.IService
{
    public interface IServiceService
    {   
        Task<IEnumerable<ServiceViewModel>> GetAllActiveServicesAsync();
        Task <IEnumerable<ServiceViewModel>> GetActiveServicesWithPaginationAsync(int payload,int pageIndex);
        Task<IEnumerable<ServiceViewModel>> GetAllServicesAsync();
        //Task<ServiceDto> GetServiceByIdAsync(int id);
        Task<IEnumerable<ServiceViewModel>> GetServicesWithPaginationAsync(int payload, int payindex);
        //Task<ServiceDto> AddServiceAsync(CreateServiceDto createServiceDto);
        //Task<ServiceDto> UpdateServiceAsync(int id, UpdateServiceDto updateServiceDto);
        //Task DeleteServiceAsync(int id);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Others;
using DataAccess.Dtos.ServiceCenter;

namespace Application.Interfaces
{
    public interface IServiceCenterService
    {
        Task<ServiceCenterViewDto> GetCenterInformationAsync();
        Task<ServiceCenterViewModel> GetServiceCenterInformationAsync();
        Task UpdateServiceCenterAsync(ServiceCenterViewModel model);
    }
}

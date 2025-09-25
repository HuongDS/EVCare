using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Others;

namespace Application.Interfaces
{
    public interface IServiceCenterService
    {
        Task<ServiceCenterViewDto> GetCenterInformationAsync();
    }
}

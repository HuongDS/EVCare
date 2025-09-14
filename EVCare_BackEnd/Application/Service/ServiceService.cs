using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.IService;
using DataAccess.Dtos.Service;

namespace Application.Service
{
    public class ServiceService : IServiceService
    {
        public Task<IEnumerable<ServiceViewModel>> GetAllServicesAsync()
        {
            throw new NotImplementedException();
        }
    }
}

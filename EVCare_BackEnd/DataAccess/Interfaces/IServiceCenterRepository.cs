using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IServiceCenterRepository : IGenericRepository<ServiceCenter>
    {
        Task<int> GetSlotLimitAsync();
        public Task<int> GetLimitBookingOfServiceCenter();
        public Task<int> GetAppactityOfServiceCenter();
    }
}

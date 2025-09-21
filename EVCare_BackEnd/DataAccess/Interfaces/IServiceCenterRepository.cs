using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Interfaces
{
    public interface IServiceCenterRepository
    {
        public Task<int> GetLimitBookingOfServiceCenter();
        public Task<int> GetAppactityOfServiceCenter();
    }
}

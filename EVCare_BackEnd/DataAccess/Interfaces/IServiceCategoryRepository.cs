using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.ServiceCategory;

namespace DataAccess.Interfaces
{
    public interface IServiceCategoryRepository
    {
        public Task<IEnumerable<ServiceCategoryViewModel>> GetServiceCategoryAndService();
    }
}

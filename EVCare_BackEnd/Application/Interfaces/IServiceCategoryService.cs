using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.ServiceCategory;

namespace Application.Interfaces
{
    public interface IServiceCategoryService
    {
        public Task<IEnumerable<ServiceCategoryViewModel>> GetServiceCategoryAndService();


    }
}

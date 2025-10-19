using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.TechnicianCategory;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface ITechnicianCategoryRepository : IGenericRepository<ServiceCategory>
    {
        Task<PageResultDto<TechnicianCategoryViewModel>> GetAllTechnicianCategories(TechnicianCategoryDto model);
    }
}

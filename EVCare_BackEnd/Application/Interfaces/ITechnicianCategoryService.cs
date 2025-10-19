using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.TechnicianCategory;

namespace Application.Interfaces
{
    public interface ITechnicianCategoryService
    {
        Task<PageResultDto<TechnicianCategoryViewModel>> GetAllTechnicianCategories(TechnicianCategoryDto model);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.TechnicianCategory;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class TechnicianCategoryService : ITechnicianCategoryService
    {
        private readonly ITechnicianCategoryRepository _technicianCategoryRepository;
        public TechnicianCategoryService(ITechnicianCategoryRepository technicianCategoryRepository)
        {
            _technicianCategoryRepository = technicianCategoryRepository;
        }
        public async Task<PageResultDto<TechnicianCategoryViewModel>> GetAllTechnicianCategories(TechnicianCategoryDto model)
        {
            return await _technicianCategoryRepository.GetAllTechnicianCategories(model);
        }
    }
}

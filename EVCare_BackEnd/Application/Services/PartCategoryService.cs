using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.PartCategory;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class PartCategoryService : IPartCategoryService
    {
        private readonly IPartCategoryRepository _partCategoryRepository;
        public PartCategoryService(IPartCategoryRepository partCategoryRepository)
        {
            _partCategoryRepository = partCategoryRepository;
        }

        public async Task<PageResultDto<PartCategoryViewModel>> GetCategories(CategoryQueryDto model)
        {
            return await _partCategoryRepository.GetCategories(model);
        }
    }
}

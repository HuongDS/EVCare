using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.PartCategory;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class PartCategoryService : IPartCategoryService
    {
        private readonly IPartCategoryRepository _partCategoryRepository;
        private readonly IMapper _mapper;
        public PartCategoryService(IPartCategoryRepository partCategoryRepository,IMapper mapper)
        {
            _partCategoryRepository = partCategoryRepository;
            _mapper = mapper;
        }

        public async Task<int> CreateCategory(PartCategoryCreateModel model)
        {
            var entity = _mapper.Map<DataAccess.Entities.PartCategory>(model);
            return (await _partCategoryRepository.AddAsync(entity)).Id;
        }

        public async Task<PageResultDto<PartCategoryViewModel>> GetCategories(CategoryQueryDto model)
        {
            return await _partCategoryRepository.GetCategories(model);
        }
    }
}

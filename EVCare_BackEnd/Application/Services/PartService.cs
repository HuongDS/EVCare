using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class PartService : IPartService
    {
        private readonly IPartRepository _partRepository;
        private readonly IPartCategoryRepository _partCategoryRepository;
        private readonly IMapper _mapper;
        public PartService(IPartRepository partRepository,IPartCategoryRepository partCategoryRepository,IMapper mapper)
        {
            _partRepository = partRepository;
            _partCategoryRepository = partCategoryRepository;
            _mapper = mapper;
        }

        public async Task<int> CreateAPart(PartCreateModel model)
        {
            var category = await _partCategoryRepository.GetByIdAsync(model.CategoryId);
            if (category == null)
            {
                throw new Exception("Category not found");
            }
            var part = _mapper.Map<DataAccess.Entities.Part>(model);
            var id = (await _partRepository.AddAsync(part)).Id;
            return id;
        }

        public async Task<PageResultDto<PartViewModel>> GetAllParts(PartQueryDto model)
        {
            return await _partRepository.GetAllParts(model);
        }

        public Task UpdateAPart(int id, PartAdminUpdateModel model)
        {
            throw new NotImplementedException();
        }
    }
}

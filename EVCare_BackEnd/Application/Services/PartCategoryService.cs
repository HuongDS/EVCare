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
        private readonly IPartRepository _partRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPartService _partService;
        public PartCategoryService(
            IPartCategoryRepository partCategoryRepository,
            IMapper mapper,IUnitOfWork unitOfWork,IPartRepository partRepository
            ,IPartService partService
            )
        {
            _partCategoryRepository = partCategoryRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _partRepository = partRepository;
            _partService = partService;

        }

        public async Task<int> CreateCategory(PartCategoryCreateModel model)
        {
            var entity = _mapper.Map<DataAccess.Entities.PartCategory>(model);
            return (await _partCategoryRepository.AddAsync(entity)).Id;
        }

        public async Task DeleteCategory(int id,int accountId)
        {
            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                var category = await _partCategoryRepository.GetByIdAsync(id);
                if (category == null || category.Deleted_At != DateTime.MinValue)
                {
                    throw new Exception("Category not found");
                }
                var ids = await _partRepository.GetPartIdsByCategoryId(id);
                foreach (var partId in ids)
                {
                    await _partService.DetelePart(partId, accountId);
                }
                await _partCategoryRepository.Delete(id);
            });
           
        }

        public async Task<PageResultDto<PartCategoryViewModel>> GetCategories(CategoryQueryDto model)
        {
            return await _partCategoryRepository.GetCategories(model);
        }

        public async Task RestoreCategory(int id, int accountId) {
            await _unitOfWork.ExecuteInTransactionAsync( async () =>
            {
                var partCategory = await _partCategoryRepository.GetByIdAsync(id);
                if (partCategory == null || partCategory.Deleted_At == DateTime.MinValue)
                {
                    throw new Exception("Category not found");
                }
                partCategory.Deleted_At = DateTime.MinValue;
                var ids = await _partRepository.GetPartIdsByCategoryId(id);
                foreach(var partId in ids)
                {
                    await _partService.RestoreAPart(partId, accountId);
                }
                await _partCategoryRepository.UpdateAsync(partCategory);
            });
        }

        public async Task<int> UpdateCategory(PartCategoryCreateModel model, int id) {
            var partCategory = await _partCategoryRepository.GetByIdAsync(id);
            if (partCategory == null || partCategory.Deleted_At != DateTime.MinValue)
            {
                throw new Exception("Category not found");
            }
            partCategory.Name = model.Name;
            partCategory.Description = model.Description;
            await _partCategoryRepository.UpdateAsync(partCategory);
            return partCategory.Id;
        }
    }
}

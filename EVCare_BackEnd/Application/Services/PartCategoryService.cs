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
        public PartCategoryService(IPartCategoryRepository partCategoryRepository,IMapper mapper,IUnitOfWork unitOfWork,IPartRepository partRepository)
        {
            _partCategoryRepository = partCategoryRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _partRepository = partRepository;
        }

        public async Task<int> CreateCategory(PartCategoryCreateModel model)
        {
            var entity = _mapper.Map<DataAccess.Entities.PartCategory>(model);
            return (await _partCategoryRepository.AddAsync(entity)).Id;
        }

        public async Task DeleteCategory(int id)
        {
            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                var category = await _partCategoryRepository.GetByIdAsync(id);
                if (category == null || category.Deleted_At != DateTime.MinValue)
                {
                    throw new Exception("Category not found");
                }
                await _partRepository.DeleteByCategoryId(id);
                await _partCategoryRepository.Delete(id);
            });
           
        }

        public async Task<PageResultDto<PartCategoryViewModel>> GetCategories(CategoryQueryDto model)
        {
            return await _partCategoryRepository.GetCategories(model);
        }
    }
}

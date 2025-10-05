using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.PartCategory;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IPartCategoryRepository : IGenericRepository<PartCategory>
    {
        Task<PageResultDto<PartCategoryViewModel>> GetCategories(CategoryQueryDto model);
    }
}

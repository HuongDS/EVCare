using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.PartCategory;
using DataAccess.Interfaces;

namespace Application.Interfaces
{
    public interface IPartCategoryService
    {
        public Task<PageResultDto<PartCategoryViewModel>> GetCategories(CategoryQueryDto model);
       
    }
}

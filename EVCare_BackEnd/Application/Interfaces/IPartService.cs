using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;

namespace Application.Interfaces
{
    public interface IPartService
    {
        Task<PageResultDto<PartViewModel>> GetAllParts(PartQueryDto model);
    }
}

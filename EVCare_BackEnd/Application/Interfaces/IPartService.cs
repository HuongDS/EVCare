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
        Task<int> CreateAPart(PartCreateModel model);
        Task DeleteAPart(int id);
        Task<byte[]> ExportPartAsync();
        Task<PageResultDto<PartViewModel>> GetAllParts(PartQueryDto model);
        Task UpdateAPart(int id,PartStaffUpdateModel model);
    }
}

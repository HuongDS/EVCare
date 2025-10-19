using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IPartRepository : IGenericRepository<Part>, IGenericCategoryRepository<Part>
    {
        Task<PageResultDto<PartViewModel>> GetAllParts(PartQueryDto model);
        Task UpdateStockPartAsync(int partID, int quantity);
        Task<bool> CheckExist(int partId);
        void Update(Part part);
        Task<Dictionary<int, Part>> GetPartWithIDs(List<int> partIds);
        Task DeleteByCategoryId(int id);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.AI;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IOrderPartRepository
    {
        Task AddRange(IEnumerable<OrderPart> orderPartLists);
        Task AddRangeAsync(List<OrderPart> orderParts);
        Task <IEnumerable<OrderPart>> GetOrderPart(int orderId, int technicianId);
        Task<IEnumerable<OrderPartViewModel>> GetOrderPartViewModelAsync(int orderId);
        Task<List<PartBrief>> GetPartBriefs();
        Task<IEnumerable<PartSummaryViewModel>> GetTopParts(PartSummaryQueryDto model);
        Task RemoveRange(int orderId, int technicianId);
    }
}

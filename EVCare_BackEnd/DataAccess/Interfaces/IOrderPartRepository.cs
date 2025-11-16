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
        Task<OrderPart> GetOrderPartByOrderIdAndPartId(int orderId, int partId, int technicianId);
        Task<IEnumerable<OrderPartViewModel>> GetOrderPartViewModelAsync(int orderId);
        Task<IEnumerable<OrderPartViewModel>> GetOrdersForTechnicianAsync(int technicianId, int orderId);
        Task<List<PartBrief>> GetPartBriefs();
        Task<IEnumerable<int>> GetPartByOrderId(int orderId);
        Task<List<int>> GetPartIdsInAppointmentByTechId(int orderId, int technician);
        Task<IEnumerable<PartSummaryViewModel>> GetTopParts(PartSummaryQueryDto model);
        Task RemoveRange(int orderId, int technicianId);
        Task UpdateAsync(OrderPart orderPart);
        Task UpdateCompletedStatusByOrderIdAndTechnicianId(int orderId, int technician);
    }
}

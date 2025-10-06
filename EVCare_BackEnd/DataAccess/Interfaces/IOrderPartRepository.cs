using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.AI;
using DataAccess.Dtos.OrderPart;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IOrderPartRepository
    {
        Task AddRange(IEnumerable<OrderPart> orderPartLists);
        Task AddRangeAsync(List<OrderPart> orderParts);
        Task <Dictionary<int,OrderPart>> GetOrderPart(int orderId, int technicianId);
        Task<IEnumerable<OrderPartViewModel>> GetOrderPartViewModelAsync(int orderId);
        Task<List<PartBrief>> GetPartBriefs();
    }
}

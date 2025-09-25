using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.OrderPart;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IOrderPartRepository
    {
        Task AddRangeAsync(List<OrderPart> orderParts);
        Task<IEnumerable<OrderPartViewModel>> GetOrderPartViewModelAsync(int orderId);
    }
}

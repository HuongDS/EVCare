using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Orders;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        Task AddOrderPartAsync(OrderPart orderPart);
        Task<int> GetAppointmentIdByOrderId(int orderId);
        public Task<int> GetCustomerIdByOrderId(int orderId);
        Task<OrderViewModel> GetOrderDetailAsync(int orderId);
        Task<Order> GetOrderPartsByOrderId(int orderId);
        Task RemoveOrderPartsAsync(int id);
    }
}

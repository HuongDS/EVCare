using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        Task<int> GetAppointmentIdByOrderId(int orderId);
        public Task<int> GetCustomerIdByOrderId(int orderId);
    }
}

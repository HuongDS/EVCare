using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.OrderDetailLog;
using DataAccess.Entities;

namespace DataAccess.Interfaces {
    public interface IOrderDetailLogRepository : IGenericRepository<OrderDetailLog> {
        Task<OrderDetailLogViewModel> GetLogByOrderId(int orderId);
    }
}

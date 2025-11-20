using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.OrderDetailLog;

namespace Application.Interfaces {
    public interface IOrderDetailLogService {
        Task AddLogByOrderIdAndPartId(int orderId, int partId, string message);
        Task<OrderDetailLogViewModel> GetLogByOrderId(int orderId);
    }
}

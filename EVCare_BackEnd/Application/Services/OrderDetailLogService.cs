using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.OrderDetailLog;
using DataAccess.Interfaces;

namespace Application.Services {
    public class OrderDetailLogService : IOrderDetailLogService {
        private readonly IOrderDetailLogRepository _orderDetaiLogRepository;
        public OrderDetailLogService(IOrderDetailLogRepository orderDetaiLogRepository) {
            _orderDetaiLogRepository = orderDetaiLogRepository;
        }
        public async Task AddLogByOrderIdAndPartId(int orderId, int partId, string message) {
            await _orderDetaiLogRepository.AddAsync(new DataAccess.Entities.OrderDetailLog {
                OrderId = orderId,
                PartId = partId,
                Message = message,
                Created_At = DateTime.UtcNow.AddHours(7),
            });
        }

        public async Task<OrderDetailLogViewModel> GetLogByOrderId(int orderId) {
            return await _orderDetaiLogRepository.GetLogByOrderId(orderId);
        }
    }
}

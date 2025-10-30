using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Dtos.PartHistory;
using DataAccess.Dtos.Service;
using DataAccess.Interfaces;

namespace Application.Services {
    public class DashboardService : IDashboardService {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IOrderPartRepository _orderPartRepository;
        private readonly IPartHistoryRepository _partHistoryRepository;
        public DashboardService(
            IAppointmentRepository appointmentRepository,IOrderPartRepository orderPartRepository,IPartHistoryRepository partHistoryRepository) {
            _appointmentRepository = appointmentRepository;
            _orderPartRepository = orderPartRepository;
            _partHistoryRepository = partHistoryRepository;
        }
        public async Task<IEnumerable<ServiceSummaryViewModel>> GetDashboardSummaryAsync(ServiceSummaryQueryDto model) {
            return await _appointmentRepository.GetTopServicesAsync(model);
        }

        public async Task<PageResultDto<PartHistoryViewModel>> GetPartUsageHistoriesAsync(PartHistoryQueryDto model) {
           return await _partHistoryRepository.GetPartUsageHistoriesAsync(model);
        }

        public async Task<IEnumerable<PartSummaryViewModel>> GetTopUsedPartsAsync(PartSummaryQueryDto model) {
            return await _orderPartRepository.GetTopParts(model);  
        }
    }
}

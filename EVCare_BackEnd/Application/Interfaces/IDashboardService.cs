using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Dtos.PartHistory;
using DataAccess.Dtos.Service;

namespace Application.Interfaces {
    public interface IDashboardService {
        Task<IEnumerable<ServiceSummaryViewModel>> GetDashboardSummaryAsync(ServiceSummaryQueryDto model);
        Task<PageResultDto<PartHistoryViewModel>> GetPartUsageHistoriesAsync(PartHistoryQueryDto model);
        Task<IEnumerable<PartSummaryViewModel>> GetTopUsedPartsAsync(PartSummaryQueryDto model);
    }
}

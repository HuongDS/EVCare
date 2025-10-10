using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Others;

namespace Application.Interfaces
{
    public interface IAdminDashboardServices
    {
        Task<PerformanceDto> GetPerformanceAsync(DateTime from, DateTime to);
        Task<DashboardSummaryDto> GetSummaryAsync(DateTime? from = null, DateTime? to = null);
        Task<DashboardSummaryDto> GetSummaryCachedAsync(DateTime? from = null, DateTime? to = null);
    }
}

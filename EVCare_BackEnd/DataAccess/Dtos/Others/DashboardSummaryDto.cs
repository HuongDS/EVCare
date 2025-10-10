using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Others
{
    public record DashboardSummaryDto
    (
        int customer,
        int appointments,
        int cancelAppointments,
        decimal totalRevenue
    );

    public record timeSeriesPointDto(string label, decimal Value);

    public record PerformanceDto(
        IReadOnlyList<string> Labels,
        IReadOnlyList<decimal> ThisMonth,
        IReadOnlyList<decimal> LastMonth
    );

    public record DashboardUpdateDto(
        int OrdersToday,
        decimal RevenueToday,
        DateTime LastUpdate
    );

    public record InsightDto(string Message, DateTime GeneratedAt);
}

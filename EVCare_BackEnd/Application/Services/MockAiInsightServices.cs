using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Others;

namespace Application.Services
{
    public class MockAiInsightServices : IAiInsightServices
    {
        public Task<InsightDto> GenerateInsightAsync(DateTime from, DateTime to)
       => Task.FromResult(new InsightDto($"Mock insight from {from:d} to {to:d}", DateTime.UtcNow));

        public Task<IReadOnlyList<decimal>> PredictRevenueAsync(DateTime from, int nextDays)
            => Task.FromResult<IReadOnlyList<decimal>>(Enumerable.Repeat(1000m, nextDays).ToList());
    }
}

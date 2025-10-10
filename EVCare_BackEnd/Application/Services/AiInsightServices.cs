using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Others;

namespace Application.Services
{
    public class AiInsightServices : IAiInsightServices
    {
        // Inject HttpClient to call your AI endpoint (Python FastAPI / Azure OpenAI / Vertex / etc.)
        private readonly HttpClient _http;
        public AiInsightServices(HttpClient http)
        {
            _http = http;
        }

        public async Task<InsightDto> GenerateInsightAsync(DateTime from, DateTime to)
        {
            // Example: call external service `/insight` with aggregated data
            // var payload = new { from, to, data = ... };
            // var resp = await _http.PostAsJsonAsync("/insight", payload);
            // var msg = await resp.Content.ReadFromJsonAsync<string>();
            var msg = $"Revenue increased compared to last period (stub {DateTime.UtcNow}).";
            return new InsightDto(msg, DateTime.UtcNow);
        }

        public async Task<IReadOnlyList<decimal>> PredictRevenueAsync(DateTime from, int nextDays)
        {
            // Stub returns flat prediction – replace with ML output
            var r = Enumerable.Repeat(1500m, nextDays).ToList();
            return await Task.FromResult(r);
        }
    }
}

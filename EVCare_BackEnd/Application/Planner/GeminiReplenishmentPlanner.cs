using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.AI;
using DataAccess.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Application.Planner
{
    public class GeminiReplenishmentPlanner : IReplenishmentPlanner
    {
        private readonly IHttpClientFactory _httpFactory;
        private readonly IConfiguration _cfg;
        private readonly IOrderPartRepository _orderPartRepository;
        public GeminiReplenishmentPlanner(IOrderPartRepository orderPartRepository, IConfiguration config,IHttpClientFactory httpClientFactory)
        {
            _orderPartRepository = orderPartRepository;
            _httpFactory = httpClientFactory;
            _cfg = config;

        }
        public async Task<IReadOnlyList<ReplenishmentItem>> SuggestAsync(int leadTimeDays = 5, double serviceLevel = 0.95, bool includeAll = true)
        {
            List<PartBrief> data = await _orderPartRepository.GetPartBriefs();
            var jsonContext = JsonSerializer.Serialize(data);
            var prompt = BuildOneShotPrompt(jsonContext, leadTimeDays, serviceLevel, includeAll);
            var key = _cfg["Gemini:ApiKey"] ?? throw new InvalidOperationException("Missing Gemini:ApiKey");
            var model = _cfg["Gemini:Model"] ?? "gemini-1.5-flash";
            var baseUrl = _cfg["Gemini:Endpoint"] ?? "https://generativelanguage.googleapis.com/v1beta";
            var url = $"{baseUrl}/models/{model}:generateContent?key={key}";
            var payload = new
            {
                contents = new[] { new { role = "user", parts = new[] { new { text = prompt } } } },
                generationConfig = new { temperature = 0, response_mime_type = "application/json" }
            };

            var http = _httpFactory.CreateClient();
            using var resp = await http.PostAsJsonAsync(url, payload);
            resp.EnsureSuccessStatusCode();
            var raw = await resp.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(raw);
            var text = doc.RootElement
                          .GetProperty("candidates")[0]
                          .GetProperty("content").GetProperty("parts")[0]
                          .GetProperty("text").GetString() ?? "{}";
            using var root = JsonDocument.Parse(text);
            var nameMap = data.ToDictionary(x => x.PartId, x => x.Name);
            var stockMap = data.ToDictionary(x => x.PartId, x => x.Stock);
            var validIds = nameMap.Keys.ToHashSet();
           var items = root.RootElement.GetProperty("items").EnumerateArray()
                .Select(x =>
                {
                    int partId = x.GetProperty("partId").GetInt32();
                    int min = Math.Max(0, x.GetProperty("minStock").GetInt32());
                    string reason = x.TryGetProperty("reason", out var r) ? (r.GetString() ?? "") : "";
                    string partName = nameMap[partId];
                    return new ReplenishmentItem
                    {
                        PartId = partId,
                        MinStock = min,
                        PartName = partName,
                        Reason = reason
                    };
                })
                .Where(x=>validIds.Contains(x.PartId))
                .OrderByDescending(i => Math.Max(0, i.MinStock - (stockMap.TryGetValue(i.PartId, out var s) ? s : 0)))
                .ToList();
            if (!includeAll)
                items = items.Where(i => i.MinStock > (stockMap.TryGetValue(i.PartId, out var s) ? s : 0)).ToList();
            return items;

        }

        private static string BuildOneShotPrompt(string jsonContext, int lead, double sl, bool includeAll) => $@"
You are an inventory replenishment planner for a single-site EV service center.
Input: a JSON array where each item has: partId (int), name, stock, avgUse7d, avgUse30d (avg/day).

REQUIREMENTS:
- Compute **minStock** (minimum stock) for each part to cover demand for {lead} days plus a small safety margin aligned with service level {sl:P0}.
- Heuristic:
  base = max(avgUse7d, avgUse30d, 0.2);
  safety = 1.1 // ~ +10%
  minStock = ceil(base * {lead} * safety)

RETURN JSON ONLY:
{{
  ""items"": [
    {{ ""partId"": 0, ""minStock"": 0, ""reason"": ""<=160 chars"" }}
  ]
}}

Rules:
- Use only partId values provided in the input (**partId is an integer**).
- Do NOT return names; the backend will join names by partId.
- includeAll = {includeAll.ToString().ToLower()} (if true, still include items where minStock <= stock).

DATA:
{jsonContext}

Return ONLY the JSON object above. No extra text outside the JSON.";
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Helper;
using Application.Interfaces;
using DataAccess.Dtos.AI;
using DataAccess.Dtos.Pagination;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;

namespace Application.Planner
{
    public class GeminiReplenishmentPlanner : IReplenishmentPlanner
    {
        private readonly IHttpClientFactory _httpFactory;
        private readonly IConfiguration _cfg;
        private readonly IOrderPartRepository _orderPartRepository;
        public GeminiReplenishmentPlanner(IOrderPartRepository orderPartRepository, IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _orderPartRepository = orderPartRepository;
            _httpFactory = httpClientFactory;
            _cfg = config;

        }
        public async Task<PageResultDto<ReplenishmentItem>> SuggestAsync(AIQueryDto dto)
        {
            List<PartBrief> data = await _orderPartRepository.GetPartBriefs();
            var jsonContext = JsonSerializer.Serialize(data);
            var prompt = BuildOneShotPrompt(jsonContext, dto.LeadDate);
            var key = _cfg["Gemini:ApiKey"] ?? throw new InvalidOperationException("Missing Gemini:ApiKey");
            var model = (_cfg["Gemini:Model"] ?? "gemini-1.5-flash").Trim();
            var baseUrl = (_cfg["Gemini:Endpoint"] ?? "https://generativelanguage.googleapis.com/v1beta")
                          .Trim().TrimEnd('/');
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
                     int aiOrd = Math.Max(0, x.GetProperty("needQuantity").GetInt32());
                     int mustOrd = Math.Max(0, min - (stockMap.TryGetValue(partId, out var s) ? s : 0));
                     string reason = x.TryGetProperty("reason", out var r) ? (r.GetString() ?? "") : "";
                     string partName = nameMap[partId];
                     return new ReplenishmentItem
                     {
                         PartId = partId,
                         MinStock = min,
                         PartName = partName,
                         Reason = reason,
                         NeedQuantity = Math.Max(aiOrd, mustOrd)
                     };

                 })
                 .Where(x => validIds.Contains(x.PartId))
                 .ApplySorting(dto.SortField, dto.SortOrder)
                 .ToList();
                

            return IMemoryPaginationHelper.Pagination(items, dto.PageSize.Value, dto.PageIndex.Value);
                 
           
        }

        private static string BuildOneShotPrompt(string jsonContext, int lead, bool includeAll = false) => $@"
                You are an inventory replenishment planner for a single-site EV service center.
                Input: a JSON array; each item has: partId (int), name, stock, avgUse7d, avgUse30d (avg/day).

                REQUIREMENTS:
                - Compute minStock for the next {lead} days with a data-driven safety margin (no service level provided).
                - Then compute needQuantity = max(0, minStock - stock).

                Heuristic:
                  base   = max(avgUse7d, avgUse30d, 0.2)   // daily demand baseline

                  // volatility proxy: how much 7d exceeds 30d
                  ratio  = (avgUse30d > 0 ? avgUse7d / avgUse30d : (avgUse7d > 0 ? 2.0 : 1.0))

                  // choose safety by volatility
                  // high volatility → larger buffer
                  safety =
                    ratio >= 1.8 ? 1.25 :
                    ratio >= 1.4 ? 1.18 :
                    ratio >= 1.1 ? 1.12 : 1.08;

                  minStock = ceil(base * {lead} * safety)

                RETURN JSON ONLY:
                {{
                  ""items"": [
                    {{ ""partId"": 0, ""minStock"": 0, ""needQuantity"": 0,
                       ""reason"": ""<=1000 chars; show reason why admin should add this part"" }}
                  ]
                }}

                Rules:
                - Use only partId values from input (partId is an integer).
                - minStock and needQuantity must be non-negative integers (<= 10000).
                - includeAll = {includeAll.ToString().ToLower()} (if true, include items even when orderQty = 0).
                - Keep reason clear and <=1000 chars show proof that the spare part must have that minstock only shows text not formula.
                 for example in the next {lead} days if avg7day is like this and avg30day is like this and avg30day is like this and avg30day so you should add needQuantity   

                DATA:
                {jsonContext}

                Return ONLY the JSON object above; no extra text outside the JSON.";
    }
}

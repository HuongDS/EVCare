using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Others;
using Microsoft.Extensions.Configuration;

namespace Application.Services
{
    public class AiInsightServices : IAiInsightServices
    {
        // Inject HttpClient to call your AI endpoint (Python FastAPI / Azure OpenAI / Vertex / etc.)
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly IAdminDashboardServices _adminDashboardServices;

        public AiInsightServices(HttpClient http, IConfiguration configuration,
            IAdminDashboardServices adminDashboardServices)
        {
            _http = http;
            _apiKey = configuration["AiService:ApiKey"]!;
            _adminDashboardServices = adminDashboardServices;
        }

        public async Task<InsightDto> GenerateInsightAsync(DateTime from, DateTime to)
        {
            var performance = await _adminDashboardServices.GetPerformanceAsync(from, to);

            var prompt = $"""
                You are an experienced business data analyst working for EVCare — an EV (Electric Vehicle) maintenance and service center in Vietnam.

                Analyze the following revenue performance data between {from:yyyy-MM-dd} and {to:yyyy-MM-dd}. 
                All values are in Vietnamese đồng (VND).

                Data (JSON format):
                {JsonSerializer.Serialize(performance, new JsonSerializerOptions { WriteIndented = true })}

                Your tasks:
                1. Compare the current period ("thisSeries") with the previous month ("lastSeries").
                2. Identify the key revenue trends (growth, drop, or anomaly).
                3. Highlight the highest and lowest days if relevant.
                4. Suggest likely causes and actionable recommendations for improvement.

                Formatting rules:
                - Use English.
                - Keep all numeric values in VND (no $ or USD symbols).
                - Keep the response concise (3–5 sentences).
                """;

            var payload = new
            {
                contents = new[]
                {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
            };

            var url = $"models/gemini-2.0-flash-001:generateContent?key={_apiKey}";

            var response = await _http.PostAsJsonAsync(url, payload);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API error {response.StatusCode}: {body}");
            }

            response.EnsureSuccessStatusCode();

            using var stream = await response.Content.ReadAsStreamAsync();
            using var doc = await JsonDocument.ParseAsync(stream);

            var msg = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return new InsightDto(msg ?? "No insight generated.", DateTime.UtcNow);
        }

        public async Task<IReadOnlyList<decimal>> PredictRevenueAsync(DateTime from, int nextDays)
        {
            var to = DateTime.UtcNow;
            var performance = await _adminDashboardServices.GetPerformanceAsync(from, to);

            var combined = performance.Labels
                            .Select((label, index) => new
                            {
                                day = label,
                                thisMonth = performance.ThisMonth.ElementAtOrDefault(index),
                                lastMonth = performance.LastMonth.ElementAtOrDefault(index)
                            })
                            .ToList();

            var prompt = $$"""
                You are a financial forecasting AI assistant for EVCare — an EV maintenance center in Vietnam.

                Below is the daily revenue data of the current month (ThisMonth) and last month (LastMonth).
                Each entry aligns by index — "Labels" are day numbers ("01" = 1st day).

                Data (JSON):
                {{JsonSerializer.Serialize(performance, new JsonSerializerOptions { WriteIndented = true })}}

                Your task:
                1. Analyze the revenue trend from ThisMonth and LastMonth.
                2. Identify if there is enough variation to build a prediction trend.
                3. Explain in detail what you observe (even if most values are zero).
                4. Then, predict revenue for the next {{nextDays}} days in VND.

                **Output must be a JSON object like this:**
                {
                  "analysis": "Your detailed reasoning about the data (e.g., trend, missing values, anomalies)",
                  "reason": "Why you predicted these numbers or why prediction is uncertain",
                  "prediction": [ list of decimal values ]
                }

                Rules:
                - If most data is zero, explain clearly why.
                - Do not output all zeros unless justified in 'reason'.
                - Always produce a valid JSON.
                """;


            var payload = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
        }
            };

            var url = $"models/gemini-2.0-flash-001:generateContent?key={_apiKey}";
            var response = await _http.PostAsJsonAsync(url, payload);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API error {response.StatusCode}: {body}");
            }

            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            var text = json
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            try
            {
                var start = text?.IndexOf('{') ?? -1;
                var end = text?.LastIndexOf('}') ?? -1;
                if (start >= 0 && end > start)
                {
                    var jsonPart = text.Substring(start, end - start + 1);
                    using var doc = JsonDocument.Parse(jsonPart);

                    if (doc.RootElement.TryGetProperty("prediction", out var pred))
                    {
                        var numbers = pred.EnumerateArray()
                            .Select(e => e.TryGetDecimal(out var v) ? v : 0m)
                            .ToList();
                        return numbers;
                    }
                }
                return Enumerable.Repeat(0m, nextDays).ToList();
            }
            catch (Exception ex)
            {
                return Enumerable.Repeat(0m, nextDays).ToList();
            }


        }
    }
}

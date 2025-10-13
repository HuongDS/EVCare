using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Application.Services
{
    public class PayOSGateWay : IPayOSGateWay
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _http;

        public PayOSGateWay(IConfiguration config, HttpClient httpClient)
        {
            _configuration = config;
            _http = httpClient; 
        }
        private string Cfg(string key) => _configuration[$"PayOS:{key}"] ?? throw new Exception($"Missing PayOS:{key}");

        public async Task<(bool ok, string? checkoutUrl, string raw)> CreateAsync(long orderCode, long amount, string description, string returnUrl, string cancelUrl)
        {
            var body = new Dictionary<string, object>
            {
                { "orderCode", orderCode },
                { "amount", amount }, // integer VNĐ
                { "description", description },
                { "returnUrl", returnUrl },
                { "cancelUrl", cancelUrl }
            };
            body["signature"] = Hmac(body);

            var req = new HttpRequestMessage(HttpMethod.Post, Cfg("Endpoint"));
            req.Headers.Add("x-client-id", Cfg("ClientId"));
            req.Headers.Add("x-api-key", Cfg("ApiKey"));
            req.Content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");

           using var resp = await _http.SendAsync(req);



            var txt = await resp.Content.ReadAsStringAsync();
            if (!resp.IsSuccessStatusCode) return (false, null, txt);

            dynamic json = JsonConvert.DeserializeObject(txt);
            string? url = json?.data?.checkoutUrl;
            return (true, url, txt);
        }
        private string Hmac(Dictionary<string, object> data)
        {
            var raw = string.Join("&", data.OrderBy(k => k.Key).Select(k => $"{k.Key}={k.Value}"));
            using var h = new HMACSHA256(Encoding.UTF8.GetBytes(Cfg("ChecksumKey")));
            return Convert.ToHexString(h.ComputeHash(Encoding.UTF8.GetBytes(raw))).ToLower();
        }

        public bool Verify(string rawBody, string? headerSignature)
        {
            if (string.IsNullOrWhiteSpace(headerSignature)) return true;
            using var h = new HMACSHA256(Encoding.UTF8.GetBytes(Cfg("ChecksumKey")));
            var hex = Convert.ToHexString(h.ComputeHash(Encoding.UTF8.GetBytes(rawBody))).ToLower();
            return string.Equals(hex, headerSignature, StringComparison.OrdinalIgnoreCase);
        }
    }
}

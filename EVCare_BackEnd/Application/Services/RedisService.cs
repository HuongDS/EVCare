using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

using StackExchange.Redis;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Services
{
    public class RedisService : IRedisService
    {
        private readonly IDatabase _db;
        public RedisService(IConnectionMultiplexer redis)
        {
            _db = redis.GetDatabase();
        }

        public async Task DeleteAsync(string v)
        {
            await _db.KeyDeleteAsync(v);
        }

        public async Task<T?> GetObjectData<T>(string email) where T : class
        {
            var value = await _db.StringGetAsync(email);
            return value.HasValue ? JsonSerializer.Deserialize<T>(value!) : null;
        }

        public async Task SaveDate(Invoice invoice, string orderCode)
        {
            await _db.StringSetAsync(
                orderCode,
               JsonSerializer.Serialize(invoice),
               TimeSpan.FromMinutes(5)
   );
        }
        public async Task<bool> SetObjectDataAsync<T>(string key, T value, TimeSpan expiry) where T : class
        {
            var jsonValue = JsonSerializer.Serialize(value);
            return await _db.StringSetAsync(key, jsonValue, expiry);
        }
    }
}

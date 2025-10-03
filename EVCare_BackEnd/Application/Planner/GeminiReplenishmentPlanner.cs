using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
        }
    }
}

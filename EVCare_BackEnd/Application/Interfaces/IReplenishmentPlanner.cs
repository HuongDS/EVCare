using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.AI;

namespace Application.Interfaces
{
    public interface IReplenishmentPlanner
    {
        Task<IReadOnlyList<ReplenishmentItem>> SuggestAsync(int leadTimeDays = 5, double serviceLevel = 0.95, bool includeAll = true);
    }
}

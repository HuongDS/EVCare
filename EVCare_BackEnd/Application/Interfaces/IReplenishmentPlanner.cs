using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.AI;
using DataAccess.Dtos.Pagination;

namespace Application.Interfaces
{
    public interface IReplenishmentPlanner
    {
        Task<PageResultDto<ReplenishmentItem>> SuggestAsync(AIQueryDto dto);
    }
}

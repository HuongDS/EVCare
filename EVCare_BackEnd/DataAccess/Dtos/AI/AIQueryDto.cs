using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;

namespace DataAccess.Dtos.AI
{
    public class AIQueryDto : BaseQueryDto
    {
        public int LeadDate { get; set; } = 5;

    }
}

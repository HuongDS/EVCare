using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination
{
    public class BaseQueryDto
    {
        public int? PageSize { get; set; } = 10;
        public int? PageIndex { get; set; } = 1;
        public string[]? SortField { get; set; }
        public string[]? SortOrder { get; set; }
    }
}

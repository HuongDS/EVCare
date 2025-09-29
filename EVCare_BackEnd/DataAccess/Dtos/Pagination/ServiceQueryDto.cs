using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination
{
    public class ServiceQueryDto : BaseQueryDto
    {
        public string? Keyword { get; set; } = string.Empty;
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination
{
    public class CategoryQueryDto : BaseQueryDto
    {
        public string? CategoryName { get; set; } = string.Empty;
        public bool? IsDelete { get; set; }
    }
}

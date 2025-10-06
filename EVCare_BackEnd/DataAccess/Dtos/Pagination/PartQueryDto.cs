using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination
{
    public class PartQueryDto : BaseQueryDto
    {
        public string PartName { get; set; } = string.Empty;
        public int? CategoryId { get; set; }

    }
}

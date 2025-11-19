using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination {
    public class TechnicianPartQueryDto : BaseQueryDto {
        public string? Keyword { get; set; }
        public List<int>? PartIds { get; set; }

    }
}

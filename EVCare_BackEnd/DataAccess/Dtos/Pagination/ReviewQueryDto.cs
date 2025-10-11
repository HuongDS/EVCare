using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination
{
    public class ReviewQueryDto : BaseQueryDto
    {
        public int? MinRating { get; set; } = 1;
        public int? MaxRating { get; set; } = 5;
        public IEnumerable<int>? ServiceIds { get; set; }

    }
}

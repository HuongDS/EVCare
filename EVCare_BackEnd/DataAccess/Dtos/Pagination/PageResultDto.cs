using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination
{
    public class PageResultDto<T> where T : class
    {
        public IEnumerable<T> items { get; set; }
        public int pageSize { get; set; }
        public int pageIndex { get; set; }
        public int totalItems { get; set; }
        public int totalPages { get; set; }

    }
}

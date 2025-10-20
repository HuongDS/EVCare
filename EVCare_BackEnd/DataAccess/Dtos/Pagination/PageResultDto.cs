using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination
{
    public class PageResultDto<T> where T : class
    {
        public IEnumerable<T> Items { get; set; }
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public PageResultDto() { }

        public PageResultDto(IEnumerable<T> items, int totalItems, int pageSize = 10, int pageIndex = 1) {
            Items = items ?? new List<T>();
            TotalItems = totalItems;
            PageSize = pageSize > 0 ? pageSize : 10;
            PageIndex = pageIndex > 0 ? pageIndex : 1;
            TotalPages = (int)Math.Ceiling(totalItems / (double)PageSize);
        }

    }
}

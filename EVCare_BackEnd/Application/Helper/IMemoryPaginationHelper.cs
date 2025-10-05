using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using Microsoft.EntityFrameworkCore;

namespace Application.Helper
{
    public static class IMemoryPaginationHelper
    {
        public static PageResultDto<T> Pagination<T>(IEnumerable<T> query, int pageSize, int pageIndex) where T : class
        {

            if (pageIndex < 1) pageIndex = 1;
            if (pageSize <= 0) pageSize = 10;
            var totalItems = query.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
            var items = query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            return new PageResultDto<T>
            {
                Items = items,
                TotalItems = totalItems,
                TotalPages = totalPages,
                PageSize = pageSize,
                PageIndex = pageIndex
            };

        }


  }
}
    

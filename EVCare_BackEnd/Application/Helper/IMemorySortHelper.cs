using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
namespace Application.Helper
{
    public static class IMemorySortHelper
    {
        public static IEnumerable<T> ApplySorting<T>(this IEnumerable<T> source, string[]? sortFields, string[]? sortOrders)
        {
            if (sortFields == null || sortOrders == null || sortFields.Length != sortOrders.Length) return source;
            var ordering = string.Join(", ",
            sortFields.Zip(sortOrders, (f, o) => $"{f} {(string.Equals(o, "desc", StringComparison.OrdinalIgnoreCase) ? "desc" : "asc")}"));

            return source.AsQueryable().OrderBy(ordering).AsEnumerable();
        }

    }

}


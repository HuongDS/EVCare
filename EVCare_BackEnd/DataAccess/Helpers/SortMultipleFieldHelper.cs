using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Helpers
{
    public static class SortMultipleFieldHelper
    {
        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> source, string[]? sortFields, string[]? sortOrders)
        {
            if (sortFields == null || sortOrders == null || sortFields.Length != sortOrders.Length)
                return source;

            var orderClauses = new List<string>();
            for (int i = 0; i < sortFields.Length; i++) {
                var dir = sortOrders[i].Equals("desc", StringComparison.OrdinalIgnoreCase) ? "desc" : "asc";
                orderClauses.Add($"{sortFields[i]} {dir}");
            }

            return source.OrderBy(string.Join(", ", orderClauses));
        }
    }
    
 }


using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
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
        public static IQueryable<T> ApplyDynamicSorting<T>(this IQueryable<T> source,
        string[]? fields, string[]? orders) {
            if (fields == null || orders == null || fields.Length != orders.Length)
                return source;

            IOrderedQueryable<T>? orderedQuery = null;

            for (int i = 0; i < fields.Length; i++) {
                var field = fields[i];
                var desc = orders[i].Equals("desc", StringComparison.OrdinalIgnoreCase);

                var param = Expression.Parameter(typeof(T), "x");
                var property = Expression.Property(param, field);
                var lambda = Expression.Lambda(property, param);

                string methodName = (i == 0)
                    ? (desc ? "OrderByDescending" : "OrderBy")
                    : (desc ? "ThenByDescending" : "ThenBy");

                var result = typeof(Queryable).GetMethods()
                    .First(x => x.Name == methodName && x.GetParameters().Length == 2)
                    .MakeGenericMethod(typeof(T), property.Type)
                    .Invoke(null, new object[] { orderedQuery ?? source, lambda });

                orderedQuery = (IOrderedQueryable<T>)result!;
            }

            return orderedQuery ?? source;
        }
    }
    
 }


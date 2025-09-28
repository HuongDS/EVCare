using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Helpers
{
    public static class SortMultipleFieldHelper
    {
        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> source, string[]? sortFields, string[]? sortOrders)
        {
            if(sortFields==null || sortOrders==null || sortFields.Length!=sortOrders.Length) return source;
            IOrderedQueryable<T> orderQuery = null;
            for (int i = 0; i < sortOrders.Length; i++) {

                bool descending = sortOrders[i].ToLower() == "desc";
                string field = sortFields[i];
                if (i == 0)
                {
                    orderQuery = descending ? source.OrderByDescending(e => EF.Property<object>(e, field))
                    : source.OrderBy(e=>EF.Property<object>(e, field));
                }
                else
                {
                    orderQuery = descending?orderQuery.ThenByDescending(e => EF.Property<object>(e, field))
                        : orderQuery.ThenBy(e => EF.Property<object>(e, field));
                }
            
            }
            return orderQuery ?? source;
        }
    }
    
 }


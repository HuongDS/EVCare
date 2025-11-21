using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Pagination
{
    public class ApplicationQueryDto : BaseQueryDto
    {
        public ApplicationStatusEnum? Status { get; set; }
        public string? Keyword { get; set; }

        public DateOnly? FromDate { get; set; } = DateOnly.MinValue;
        public DateOnly? ToDate { get; set;} = DateOnly.MaxValue;


    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Pagination {
    public class PartHistoryQueryDto : BaseQueryDto {
        public DateOnly? FromDate { get; set; }
        public DateOnly? ToDate { get; set; }
        public string? Keyword { get; set; }
        public ActionTypeEnum? ActionType { get; set; }

    }
}

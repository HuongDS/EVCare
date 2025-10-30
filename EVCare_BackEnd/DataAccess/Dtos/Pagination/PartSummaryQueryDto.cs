using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination {
    public class PartSummaryQueryDto {
        public DateOnly? FromDate { get; set; }
        public DateOnly? ToDate { get; set; }
        public int? Top { get; set; } 
    }
}

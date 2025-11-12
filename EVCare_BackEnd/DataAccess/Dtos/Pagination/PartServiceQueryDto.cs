using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination {
   public class PartForServiceQueryDto : BaseQueryDto {
        public List<int>? ServiceIds { get; set; }
    }
}

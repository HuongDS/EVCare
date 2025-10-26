using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination {
    public class ServiceCategoryQueryDto : BaseQueryDto {
        public string? Name { get; set; }
    }
}

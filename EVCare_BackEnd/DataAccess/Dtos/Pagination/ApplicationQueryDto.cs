using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Pagination
{
    public class ApplicationQueryDto : BaseQueryDto
    {
        public bool? isApproved { get; set; }
    }
}

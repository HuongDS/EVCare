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
    }
}

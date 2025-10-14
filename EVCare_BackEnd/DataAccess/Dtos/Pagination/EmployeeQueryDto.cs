using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Pagination
{
    public class EmployeeQueryDto : BaseQueryDto
    {
        public string? Keyword { get; set; }
        public RoleEnum? Role { get; set; }
        public EmployeeStatusEnum? Status { get; set; }

    }
}

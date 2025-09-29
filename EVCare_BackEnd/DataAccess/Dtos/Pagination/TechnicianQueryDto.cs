using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;
using DataAccess.Enums;

namespace DataAccess.Dtos.Pagination
{
    public class TechnicianQueryDto : BaseQueryDto
    {
        public EmployeeStatusEnum? Status { get; set; } = EmployeeStatusEnum.Available;
        public IEnumerable<ServiceViewFormModel>? Skills { get; set; } = new List<ServiceViewFormModel>();
    }
}

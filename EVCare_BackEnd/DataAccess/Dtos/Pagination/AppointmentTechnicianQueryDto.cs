using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Pagination
{
    public class AppointmentTechnicianQueryDto : BaseQueryDto
    {
        public TechnicianWorkingSessionEnum? Status { get; set; } = TechnicianWorkingSessionEnum.Pending;
        public DateOnly? BeginTime { get;set; } = DateOnly.MinValue;
        public DateOnly? EndTime { get;set;} = DateOnly.MaxValue;
         
    }
}

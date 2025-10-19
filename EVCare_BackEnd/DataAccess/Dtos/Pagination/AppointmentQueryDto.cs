using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Pagination
{
    public class AppointmentQueryDto : BaseQueryDto
    {
        public string? CustomerName { get; set; } = string.Empty;
        public AppointmentStatusEnum? Status { get; set; }
        public DateOnly? BeginTime {  get; set; } = DateOnly.MinValue;
        public DateOnly? EndTime { get; set; } = DateOnly.MaxValue;
    }
}

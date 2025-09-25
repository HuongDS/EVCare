using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentGetByEmployeeFromEmployeeDto
    {
        public DateOnly currentDate { get; set; }
        public int pageSize { get; set; }
        public int pageIndex { get; set; }
        public AppointmentStatusEnum status { get; set; }
    }
}

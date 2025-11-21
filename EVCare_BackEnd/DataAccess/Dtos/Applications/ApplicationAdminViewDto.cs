using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Applications
{
    public class ApplicationAdminViewDto
    {
        public int Id
        {
            get; set;
        }

        public string EmployeeName { get; set; }
        public DateTime DateOff { get; set; }
        public string Reason { get; set; }
        public ApplicationStatusEnum Status { get; set; }

        public string Note { get; set; }
        public DateTime CreatedAt { get; set; }
        public int EmployeeId { get; set; }
    }
}

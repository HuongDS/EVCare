using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;

namespace DataAccess.Dtos.Employees
{
    public class EmployeeViewModel
    {
        public int AccountId { get; set; }
        public int EmployeeId { get; set; } 
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string CCCD { get; set; }
        public Enums.RoleEnum Role { get; set; }
        public Enums.EmployeeStatusEnum Status { get; set; }
        public bool IsBanned { get; set; }
        public string? Avatar { get; set; }

        public int? TechnicianId { get; set; }
        public double? ExpYear { get; set; }
        public List<ServiceViewFormModel>? Skills { get; set; }


    }
}

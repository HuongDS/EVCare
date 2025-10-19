using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Register;
using DataAccess.Enums;

namespace DataAccess.Dtos.Employees
{
    public class EmployeeRegisterDto
    {
        public RoleEnum role { get; set; }
        public string CCCD { get; set; }
        public double expYear { get; set; }
        public RegisterRequestDto accountInfo { get; set; }
        public string avatar { get; set; }

    }
}

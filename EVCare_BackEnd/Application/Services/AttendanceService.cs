using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IEmployeeRepository _employeeRepository;
        public AttendanceService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public Task MarkAttendanceAsync()
        {
            throw new NotImplementedException();
        }
    }
}

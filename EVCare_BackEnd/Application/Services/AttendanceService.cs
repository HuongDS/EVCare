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
        private readonly IApplicationRepository _applicationRepository;
        public AttendanceService(IEmployeeRepository employeeRepository,IApplicationRepository applicationRepository)
        {
            _applicationRepository = applicationRepository;
            _employeeRepository = employeeRepository;
        }

        public async Task MarkAttendanceAsync()
        {
            await _employeeRepository.MarkAvaliableAllEmployees();
            var applications = await _applicationRepository.GetApplicationsToday();
            foreach (var application in applications) {
                
                var employee = await _employeeRepository.GetByIdAsync(application.EmployeeId);
                employee.Status = DataAccess.Enums.EmployeeStatusEnum.OnLeave;
                await _employeeRepository.UpdateAsync(employee);
            }
            await _employeeRepository.MarkBusyForTechnician();
        }
    }
}

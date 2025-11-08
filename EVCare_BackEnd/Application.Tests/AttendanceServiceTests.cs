using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using Moq;

namespace Application.Tests {
    public class AttendanceServiceTests {
        private readonly IFixture _fixture;
        public AttendanceServiceTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });

        
         }
        [Fact]
        public async Task MarkAttendanceAsync_ShouldMarkEmployeesCorrectly() {
          
            var employeeRepository = new Mock<DataAccess.Interfaces.IEmployeeRepository>();
            employeeRepository.Setup(e=>e.MarkAvaliableAllEmployees()).Returns(Task.CompletedTask);
            employeeRepository.Setup(e => e.UpdateAsync(It.IsAny<DataAccess.Entities.Employee>()))
                .ReturnsAsync((DataAccess.Entities.Employee e) => e);
            employeeRepository.Setup(e => e.MarkBusyForTechnician()).Returns(Task.CompletedTask);
            employeeRepository.Setup(e => e.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new DataAccess.Entities.Employee
                {
                    Id = 1,
                    Status = DataAccess.Enums.EmployeeStatusEnum.Available
                });

            _fixture.Inject(employeeRepository.Object);
            var applicationRepository = new Mock<DataAccess.Interfaces.IApplicationRepository>();
           
            applicationRepository.Setup(x => x.GetApplicationsToday())
                .ReturnsAsync(new List<DataAccess.Entities.Application>
                {
                    new DataAccess.Entities.Application
                    {
                        Id = 1,
                        EmployeeId = 1,
                        DateOff = DateTime.Today,
                        Status = DataAccess.Enums.ApplicationStatusEnum.Approved,
                        Employee = new DataAccess.Entities.Employee
                        {
                            Id = 1,
                            Status = DataAccess.Enums.EmployeeStatusEnum.Available
                        }
                    },
                    new DataAccess.Entities.Application
                    {
                        Id = 2,
                        EmployeeId = 2,
                        DateOff = DateTime.Today,
                        Status = DataAccess.Enums.ApplicationStatusEnum.Approved,
                        Employee = new DataAccess.Entities.Employee
                        {
                            Id = 2,
                            Status = DataAccess.Enums.EmployeeStatusEnum.Available
                        }
                    }
                });
            _fixture.Inject(applicationRepository.Object);
            var attendanceService = _fixture.Create<Application.Services.AttendanceService>();
         
            await attendanceService.MarkAttendanceAsync();
          
            employeeRepository.Verify(x => x.MarkAvaliableAllEmployees(), Times.Once);
           
            employeeRepository.Verify(x => x.MarkBusyForTechnician(), Times.Once);
        }
    }
}

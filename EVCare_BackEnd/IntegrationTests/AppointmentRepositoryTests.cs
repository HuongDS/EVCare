using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Enums;
using DataAccess.Repositories;
using Xunit.Abstractions;

namespace IntegrationTests {
    public class AppointmentRepositoryTests : IClassFixture<DataBaseFixture> {
        private readonly DataBaseFixture _fixture;
        private readonly AppointmentRepository _repository;
        private readonly ITestOutputHelper _output;

        public AppointmentRepositoryTests(DataBaseFixture fixture, ITestOutputHelper output) {
            _fixture = fixture;
            _repository = new AppointmentRepository(_fixture.CreateContext());
        }
        [Fact]
       
        public async Task GetWithPaginationAsync_WithValidQuery_ReturnsCorrectAppointments() {
           
            var query = new AppointmentQueryDto
            {
                KeyWord = "Phuc",      
                Status = AppointmentStatusEnum.Pending,
                PageIndex = 1,
                PageSize = 5,
                SortField = new string[] { "Id" },
                SortOrder = new string[] { "asc" }
            };
 
            var result = await _repository.GetWithPaginationAsync(query);
            Assert.NotNull(result);
            Assert.NotEmpty(result.Items);
            Assert.Equal(1, result.TotalItems);
            Assert.Equal("ABC123", result.Items.First().LicensePlate);
            Assert.Equal("Phuc Sanh", result.Items.First().CustomerName);
            Assert.Single(result.Items.First().Services);
        }
        
        [Fact]
        public async Task GetAppointmentTechnicianViewModelByTechnicianId_WithValidData_ReturnsAppointments() {
           
            var query = new AppointmentTechnicianQueryDto
            {
                Status = TechnicianWorkingSessionEnum.InProgress,
                PageIndex = 1,
                PageSize = 5,
                SortField = new string[] { "Appointment_Date" },
                SortOrder = new string[] { "asc" }
            };

            int technicianId = 1;

           
            var result = await _repository.GetAppointmentTechnicianViewModelByTechnicianId(technicianId, query);

           

            Assert.NotNull(result);
            Assert.NotEmpty(result.Items);
            var appointment = result.Items.First();

            Assert.Equal("ABC123", appointment.LicensePlate);
            Assert.Equal("Phuc Sanh", appointment.CustomerName);
            Assert.Equal("Sedan", appointment.VehicleModel);
            Assert.Contains("Oil Change", appointment.Services);
            Assert.Single(appointment.Parts);
            Assert.Equal(TechnicianWorkingSessionEnum.InProgress, appointment.Status);
        }

    }
}

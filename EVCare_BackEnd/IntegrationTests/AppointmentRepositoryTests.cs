using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Enums;
using DataAccess.Repositories;

namespace IntegrationTests {
    public class AppointmentRepositoryTests : IClassFixture<DataBaseFixture> {
        private readonly DataBaseFixture _fixture;
        private readonly AppointmentRepository _repository;

        public AppointmentRepositoryTests(DataBaseFixture fixture) {
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
    }
}

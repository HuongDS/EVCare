using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using Moq;

namespace Application.Tests {
    public class VehicleServiceTests {
        private readonly IFixture _fixture;
        public VehicleServiceTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Theory, AutoData]
        public async Task CreateVehicle_WithExistedLicensePlate_ThrowsException(
            DataAccess.Dtos.Vehicle.VehicleCreateModel model,
            int customerId
            ) {
            var vehicleRepository = new Mock<DataAccess.Interfaces.IVehicleRepository>();
            vehicleRepository.Setup(v => v.CheckLicensePlate(model.LicensePlate))
                .ReturnsAsync(true);
            _fixture.Inject(vehicleRepository.Object);
            var vehicleService =_fixture.Create<Application.Services.VehicleService>();
            var exception = await Assert.ThrowsAsync<Exception>(async () =>
                await vehicleService.CreateVehicle(model, customerId));
            Assert.Equal("Licese Plate has exits", exception.Message);
        }
        [Theory, AutoData]
        public async Task CreateVehicle_WithNonExistedLicensePlate_ReturnsVehilceId(
           DataAccess.Dtos.Vehicle.VehicleCreateModel model,
           int customerId
           ) {
            var vehicleRepository = new Mock<DataAccess.Interfaces.IVehicleRepository>();
            vehicleRepository.Setup(v => v.CheckLicensePlate(model.LicensePlate))
                .ReturnsAsync(false);
            vehicleRepository.Setup(v => v.AddAsync(It.IsAny<DataAccess.Entities.Vehicle>()))
                .ReturnsAsync(new DataAccess.Entities.Vehicle
                {
                    Id = 1,
                    LicensePlate = model.LicensePlate,
                    CategoryId = model.CategoryId,
                    CustomerId = customerId,
                    Image = model.img,
                    Deleted_At = DateTime.MinValue
                });
            _fixture.Inject(vehicleRepository.Object);
            var mapperMock = new Mock<AutoMapper.IMapper>();
            mapperMock.Setup(m => m.Map<DataAccess.Entities.Vehicle>(It.IsAny<DataAccess.Dtos.Vehicle.VehicleCreateModel>()))
                .Returns(new DataAccess.Entities.Vehicle
                {
                    Id = 1,
                    LicensePlate = model.LicensePlate,
                    CategoryId = model.CategoryId,
                    CustomerId = customerId,
                    Image = model.img,
                    Deleted_At = DateTime.MinValue
                });
            _fixture.Inject(mapperMock.Object);
           
            var vehicleService = _fixture.Create<Application.Services.VehicleService>();
             
            var result =  await vehicleService.CreateVehicle(model, customerId);
            Assert.Equal(1, result);
        }

    }
}

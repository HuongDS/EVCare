using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Dtos.VehicleCategory;
using Moq;

namespace Application.Tests {
    public class VehicleCategoryServiceTests {
        private readonly IFixture _fixture;
        public VehicleCategoryServiceTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Theory, AutoData]
        public async Task CreateCategoryAsync_ShouldReturnCreatedCategoryId(VehicleCategoryCreateModel model) {

            var vehicleCategoryRepositoryMock = new Mock<DataAccess.Interfaces.IVehicleCategoryRepository>();
            vehicleCategoryRepositoryMock.Setup(v => v.AddAsync(It.IsAny<DataAccess.Entities.VehiclesCategory>()))
                .ReturnsAsync((DataAccess.Entities.VehiclesCategory category) =>
                {
                    category.Id = 1;
                    return category;
                });
            _fixture.Inject(vehicleCategoryRepositoryMock.Object);
            var vehiclePartCompatibilityRepositoryMock = new Mock<DataAccess.Interfaces.IVehiclePartCompatibilityRepository>();
            vehiclePartCompatibilityRepositoryMock.Setup(v => v.AddRangeAsync(It.IsAny<IEnumerable<DataAccess.Entities.VehiclePartCompatibility>>()))
                .Returns(Task.CompletedTask);
            _fixture.Inject(vehiclePartCompatibilityRepositoryMock.Object);
            var unitOfWorkMock = new Mock<DataAccess.Interfaces.IUnitOfWork>();
            unitOfWorkMock.Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(async (func) => await func());
            _fixture.Inject(unitOfWorkMock.Object);
            var vehicleCategoryService = _fixture.Create<Application.Services.VehicleCategoryService>();

            var result = await vehicleCategoryService.CreateCategoryAsync(model);

            Assert.Equal(1, result);
            vehicleCategoryRepositoryMock.Verify(v => v.AddAsync(It.IsAny<DataAccess.Entities.VehiclesCategory>()), Times.Once);
            if (model.PartCategoryIds != null && model.PartCategoryIds.Length > 0) {
                vehiclePartCompatibilityRepositoryMock.Verify(v => v.AddRangeAsync(It.IsAny<IEnumerable<DataAccess.Entities.VehiclePartCompatibility>>()), Times.Once);
            }
        }

        [Theory, AutoData]
        public async Task DeleteCategoryAsync_CategoryNotFound_ShouldThrowException(int categoryId) {
            var vehicleCategoryRepositoryMock = new Mock<DataAccess.Interfaces.IVehicleCategoryRepository>();
            vehicleCategoryRepositoryMock.Setup(v => v.GetByIdAsync(categoryId))
                .ReturnsAsync((DataAccess.Entities.VehiclesCategory?)null);
            _fixture.Inject(vehicleCategoryRepositoryMock.Object);
            var vehicleCategoryService = _fixture.Create<Application.Services.VehicleCategoryService>();

            var result = await Assert.ThrowsAsync<Exception>(async () => await vehicleCategoryService.DeleteCategoryAsync(categoryId));

            Assert.Equal("Vehicle category not found", result.Message);
        }
        [Theory, AutoData]
        public async Task DeleteCategoryAsync_CategoryExists_ShouldSetDeletedAt(int categoryId) {
            var category = new DataAccess.Entities.VehiclesCategory
            {
                Id = categoryId,
                Deleted_At = DateTime.MinValue
            };
            var vehicleCategoryRepositoryMock = new Mock<DataAccess.Interfaces.IVehicleCategoryRepository>();
            vehicleCategoryRepositoryMock.Setup(v => v.GetByIdAsync(categoryId))
                .ReturnsAsync(category);
            vehicleCategoryRepositoryMock.Setup(v => v.UpdateAsync(It.IsAny<DataAccess.Entities.VehiclesCategory>()))
                .ReturnsAsync(new DataAccess.Entities.VehiclesCategory
                {
                    Id = categoryId,
                    Deleted_At = DateTime.UtcNow
                });
            _fixture.Inject(vehicleCategoryRepositoryMock.Object);
            var vehicleCategoryService = _fixture.Create<Application.Services.VehicleCategoryService>();

            await vehicleCategoryService.DeleteCategoryAsync(categoryId);

            Assert.NotEqual(DateTime.MinValue, category.Deleted_At);
            vehicleCategoryRepositoryMock.Verify(v => v.UpdateAsync(It.IsAny<DataAccess.Entities.VehiclesCategory>()), Times.Once);
        }
        [Theory, AutoData]
        public async Task UpdateCategoryAsync_CategoryNotFound_ShouldThrowException(
            int categoryId,
            VehicleCategoryCreateModel model
            ) {
            var vehicleCategoryRepositoryMock = new Mock<DataAccess.Interfaces.IVehicleCategoryRepository>();
            vehicleCategoryRepositoryMock.Setup(v => v.GetByIdAsync(categoryId))
                .ReturnsAsync((DataAccess.Entities.VehiclesCategory?)null);
            _fixture.Inject(vehicleCategoryRepositoryMock.Object);
            var unitOfWorkMock = new Mock<DataAccess.Interfaces.IUnitOfWork>();
            unitOfWorkMock.Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(async (func) => await func());
            _fixture.Inject(unitOfWorkMock.Object);

            var vehicleCategoryService = _fixture.Create<Application.Services.VehicleCategoryService>();
            var result = await Assert.ThrowsAsync<Exception>(async () => await vehicleCategoryService.UpdateCategoryAsync(categoryId, model));
            Assert.Equal("Vehicle category not found", result.Message);
        }
        [Theory, AutoData]
        public async Task UpdateCategoryAsync_CategoryExists_ShouldUpdateCategory(
            int categoryId,
            VehicleCategoryCreateModel model
            ) {
            var category = new DataAccess.Entities.VehiclesCategory
            {
                Id = categoryId,
                Name = "Old Name",
                Deleted_At = DateTime.MinValue
            };
            var vehicleCategoryRepositoryMock = new Mock<DataAccess.Interfaces.IVehicleCategoryRepository>();
            vehicleCategoryRepositoryMock.Setup(v => v.GetByIdAsync(categoryId))
                .ReturnsAsync(category);
            vehicleCategoryRepositoryMock.Setup(v => v.UpdateAsync(It.IsAny<DataAccess.Entities.VehiclesCategory>()))
                .ReturnsAsync((DataAccess.Entities.VehiclesCategory updatedCategory) => updatedCategory);
            _fixture.Inject(vehicleCategoryRepositoryMock.Object);
            var vehiclePartCompatibilityRepositoryMock = new Mock<DataAccess.Interfaces.IVehiclePartCompatibilityRepository>();
            vehiclePartCompatibilityRepositoryMock.Setup(v => v.DeleteAsyncByPartCategoryId(categoryId))
                .Returns(Task.CompletedTask);
            vehiclePartCompatibilityRepositoryMock.Setup(v => v.AddRangeAsync(It.IsAny<IEnumerable<DataAccess.Entities.VehiclePartCompatibility>>()))
                .Returns(Task.CompletedTask);
            _fixture.Inject(vehiclePartCompatibilityRepositoryMock.Object);
            var unitOfWorkMock = new Mock<DataAccess.Interfaces.IUnitOfWork>();
            unitOfWorkMock.Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(async (func) => await func());
            _fixture.Inject(unitOfWorkMock.Object);
            var vehicleCategoryService = _fixture.Create<Application.Services.VehicleCategoryService>();
            await vehicleCategoryService.UpdateCategoryAsync(categoryId, model);

            vehiclePartCompatibilityRepositoryMock.Verify(v => v.DeleteAsyncByPartCategoryId(categoryId), Times.Once);
            if (model.PartCategoryIds != null && model.PartCategoryIds.Length > 0) {
                vehiclePartCompatibilityRepositoryMock.Verify(
                    v => v.AddRangeAsync(It.IsAny<IEnumerable<DataAccess.Entities.VehiclePartCompatibility>>()), Times.Once);
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using DataAccess.Dtos.Vehicle;
using Moq;

namespace Application.Tests {
    public class ReminderServiceTests {
        private readonly IFixture _fixture;
        public ReminderServiceTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Fact]
        public async Task SendEmailRemindersAsync_EmailValidShouldSendAndInvalidShouldNotSend() {

            var vehicleRepoMock = new Mock<DataAccess.Interfaces.IVehicleRepository>();
            vehicleRepoMock.Setup(v => v.GetVehicleReminderTodayAsync())
                .ReturnsAsync(new List<VehicleReminderDto>
                {
                    new VehicleReminderDto { Id = 1, CustomerName ="Sanh",Email ="ABC", HotLine ="999" },
                    new VehicleReminderDto { Id = 2, CustomerName ="John",Email ="", HotLine ="888" },
                });
            vehicleRepoMock.SetupSequence(v=>v.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(
                new DataAccess.Entities.Vehicle 
                { Id = 1, ReminderIntervalMonths = 6, NextServiceDate = DateTime.Now })
                .ThrowsAsync(new Exception("Vehicle not found"));
            vehicleRepoMock.Setup(v=>v.UpdateAsync(It.IsAny<DataAccess.Entities.Vehicle>())).ReturnsAsync(new DataAccess.Entities.Vehicle { Id = 1, ReminderIntervalMonths = 6, NextServiceDate = DateTime.Now });

            _fixture.Inject(vehicleRepoMock.Object);
            var notificationServiceMock = new Mock<Application.Interfaces.INotificationServices>();
            notificationServiceMock.Setup(n => n.SendEmailToRemider(It.IsAny<VehicleReminderDto>()))
                .Returns(Task.CompletedTask);
                
            _fixture.Inject(notificationServiceMock.Object);

            var reminderService = _fixture.Create<Application.Services.ReminderService>();
            await reminderService.SendEmailRemindersAsync();
            notificationServiceMock.Verify(n => n.SendEmailToRemider(It.Is<VehicleReminderDto>(v => v.Id == 1)), Times.Once);
            notificationServiceMock.Verify(n => n.SendEmailToRemider(It.Is<VehicleReminderDto>(v => v.Id == 2)), Times.Once);
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Dtos.Technician;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Moq;

namespace Application.Tests {
    public class TechnicianWorkingSessionServiceTests {
        private readonly IFixture _fixture;
        public TechnicianWorkingSessionServiceTests() {
            _fixture = new Fixture()
                 .Customize(new AutoMoqCustomization { ConfigureMembers = false });
            
        }
        [Theory,AutoData]
        public async Task AddTechnicianToOrder_WithHaveOneTechnicianBusy_ThrowsExceptiion(AssignTechniciansModel model) {
            var employeeRepositoryMock = _fixture.Freeze<Mock<IEmployeeRepository>>();
            employeeRepositoryMock.Setup(t=>t.GetEmployeeByTechnicianId(It.IsAny<int>()))
                .ReturnsAsync((int technicianId) => new DataAccess.Entities.Employee
                {
                    Id = technicianId,
                    Status = DataAccess.Enums.EmployeeStatusEnum.Busy
                });
            var technicianWorkingSessionService = _fixture.Create<Application.Services.TechnicianWorkingSessionService>();
            var result = await Assert.ThrowsAsync<Exception>(async () => 
                await technicianWorkingSessionService.AddTechnicianToOrder(model)
            );
            Assert.Equal($"Technician with id {model.TechnicianIds.First()} is currently busy.", result.Message);

        }
        [Theory, AutoData]
        public async Task AddTechnicianToOrder_WithHaveOneTechnicianOnLeave_ThrowsExceptiion(AssignTechniciansModel model) {
            var employeeRepositoryMock = _fixture.Freeze<Mock<IEmployeeRepository>>();
            employeeRepositoryMock.Setup(t => t.GetEmployeeByTechnicianId(It.IsAny<int>()))
                .ReturnsAsync((int technicianId) => new DataAccess.Entities.Employee
                {
                    Id = technicianId,
                    Status = DataAccess.Enums.EmployeeStatusEnum.OnLeave
                });
            var technicianWorkingSessionService = _fixture.Create<Application.Services.TechnicianWorkingSessionService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                await technicianWorkingSessionService.AddTechnicianToOrder(model)
            );
            Assert.Equal($"Technician with id {model.TechnicianIds.First()} is currently on leave.", result.Message);

        }

        [Theory, AutoData]
        public async Task AddTechnicianToOrder_WithAllTechnicianAvailableAndModelStatusIsPending_AddsSuccessfully(AssignTechniciansModel model) {
            model.Status = DataAccess.Enums.TechnicianWorkingSessionEnum.Pending;
            var employeeRepositoryMock = _fixture.Freeze<Mock<IEmployeeRepository>>();

            employeeRepositoryMock.Setup(t => t.GetEmployeeByTechnicianId(It.IsAny<int>()))
                .ReturnsAsync((int technicianId) => new DataAccess.Entities.Employee
                {
                    Id = technicianId,
                    Status = DataAccess.Enums.EmployeeStatusEnum.Available
                });
            employeeRepositoryMock.Setup(t=>t.MarkBusyForTechnician(It.IsAny<IEnumerable<int>>()))
                .Returns(Task.CompletedTask);
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(t => t.GetAppointmentByOrderIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = 1,
                    OrderId = model.OrderId,
                    
                });
            appointmentRepositoryMock.Setup(t=>t.UpdateAsync(It.IsAny<Appointment>()))
                .ReturnsAsync((Appointment appointment) => appointment);
            var technicianWorkingSessionRepositoryMock = _fixture.Freeze<Mock<ITechnicianWorkingSessionRepository>>();
            technicianWorkingSessionRepositoryMock.Setup(t => t.AddRange(It.IsAny<IEnumerable<TechnicianWorkingSession>>()))
                .Returns(Task.CompletedTask);
            var technicianWorkingSessionService = _fixture.Create<Application.Services.TechnicianWorkingSessionService>();
            await technicianWorkingSessionService.AddTechnicianToOrder(model);
            appointmentRepositoryMock.Verify(t=>t.UpdateAsync(It.Is<Appointment>(a=>a.Status == DataAccess.Enums.AppointmentStatusEnum.AddingPart)), Times.Once);
            technicianWorkingSessionRepositoryMock.Verify(t => t.AddRange(It.IsAny<IEnumerable<TechnicianWorkingSession>>()), Times.Once);


        }

        [Theory,AutoData]
        public async Task UpdateWorkingSession_WithModelStatusIsConfirm_ShouldAppointmentIsInprogres(int technician, TechnicianWorkingSessionUpdateModel model) {

            model.Status = DataAccess.Enums.TechnicianWorkingSessionEnum.Confirm;
            var technicianWorkingSessionRepositoryMock = _fixture.Freeze<Mock<ITechnicianWorkingSessionRepository>>();
            technicianWorkingSessionRepositoryMock.Setup(t => t.UpdateStatusWorkingSession(It.IsAny<int>(), It.IsAny<TechnicianWorkingSessionUpdateModel>()))
                .Returns(Task.CompletedTask);
            technicianWorkingSessionRepositoryMock.Setup(t=>t.CheckOrderConfirm(model.OrderId))
                .ReturnsAsync(true);
            var orderRepositoryMock = _fixture.Freeze<Mock<IOrderRepository>>();
            orderRepositoryMock.Setup(t => t.UpdateAsync(It.IsAny<DataAccess.Entities.Order>()))
                .ReturnsAsync((DataAccess.Entities.Order order) => order);
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(t => t.GetAppointmentByOrderIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = 1,
                    OrderId = model.OrderId,
                    Status = DataAccess.Enums.AppointmentStatusEnum.AddingPart
                });
            appointmentRepositoryMock.Setup(t=>t.UpdateAsync(It.IsAny<DataAccess.Entities.Appointment>()))
                .ReturnsAsync((DataAccess.Entities.Appointment appointment) => appointment);
            var technicianWorkingSessionService = _fixture.Create<Application.Services.TechnicianWorkingSessionService>();
            await technicianWorkingSessionService.UpdateWorkingSession(technician, model);
            technicianWorkingSessionRepositoryMock.Verify(t => t.UpdateStatusWorkingSession(technician, model), Times.Once);
            orderRepositoryMock.Verify(orderRepositoryMock => orderRepositoryMock.UpdateAsync(It.IsAny<DataAccess.Entities.Order>()), Times.Once);
            appointmentRepositoryMock.Verify(t => t.GetAppointmentByOrderIdAsync(model.OrderId), Times.Once);
            appointmentRepositoryMock.Verify(t=>t.UpdateAsync(It.Is<DataAccess.Entities.Appointment>(a=>a.Status == DataAccess.Enums.AppointmentStatusEnum.InProgress)), Times.Once);
           

        }

        [Theory, AutoData]
        public async Task UpdateWorkingSession_WithModelStatusIsCompleted_ShouldAppointmentIsInprogres(int technician, TechnicianWorkingSessionUpdateModel model) {

            model.Status = DataAccess.Enums.TechnicianWorkingSessionEnum.Completed;
            var technicianWorkingSessionRepositoryMock = _fixture.Freeze<Mock<ITechnicianWorkingSessionRepository>>();
            technicianWorkingSessionRepositoryMock.Setup(t => t.UpdateStatusWorkingSession(It.IsAny<int>(), It.IsAny<TechnicianWorkingSessionUpdateModel>()))
                .Returns(Task.CompletedTask);
           technicianWorkingSessionRepositoryMock.Setup(t=>t.CheckOrderDone(model.OrderId))
                .ReturnsAsync(true);
            var orderRepositoryMock = _fixture.Freeze<Mock<IOrderRepository>>();
            orderRepositoryMock.Setup(t => t.UpdateAsync(It.IsAny<DataAccess.Entities.Order>()))
                .ReturnsAsync((DataAccess.Entities.Order order) => order);
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(t => t.GetAppointmentByOrderIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = 1,
                    OrderId = model.OrderId,
                    Status = DataAccess.Enums.AppointmentStatusEnum.AddingPart
                });
            appointmentRepositoryMock.Setup(t => t.UpdateAsync(It.IsAny<DataAccess.Entities.Appointment>()))
                .ReturnsAsync((DataAccess.Entities.Appointment appointment) => appointment);
            appointmentRepositoryMock.Setup(t=>t.CheckAllReadyForPickup(It.IsAny<int>()))
                .ReturnsAsync(true);
            appointmentRepositoryMock.Setup(t=>t.GetAppointmentReadyForPickUpByVehicleId(It.IsAny<int>()))
                .ReturnsAsync(new List<int>{1,2});
            appointmentRepositoryMock.Setup(t=>t.GetPaymentPendingPickupEmailModel(It.IsAny<int>()))
                .ReturnsAsync(new DataAccess.Dtos.Payment.PaymentPendingPickupEmailModel
                {
                    Email = "",
                    ServiceCenterName="EVCare"

                });
            var notificationServiceMock = _fixture.Freeze<Mock<Application.Interfaces.INotificationServices>>();
            notificationServiceMock.Setup(t=>t.SendPaymentPendingPickupEmailAsync(It.IsAny<DataAccess.Dtos.Payment.PaymentPendingPickupEmailModel>()))
                .Returns(Task.CompletedTask);
            var technicianWorkingSessionService = _fixture.Create<Application.Services.TechnicianWorkingSessionService>();
            await technicianWorkingSessionService.UpdateWorkingSession(technician, model);
            technicianWorkingSessionRepositoryMock.Verify(t => t.UpdateStatusWorkingSession(technician, model), Times.Once);
            orderRepositoryMock.Verify(orderRepositoryMock => orderRepositoryMock.UpdateAsync(It.IsAny<DataAccess.Entities.Order>()), Times.Once);
            appointmentRepositoryMock.Verify(t => t.GetAppointmentByOrderIdAsync(model.OrderId), Times.Once);
            appointmentRepositoryMock.Verify(t => t.UpdateAsync(It.Is<DataAccess.Entities.Appointment>(a => a.Status == DataAccess.Enums.AppointmentStatusEnum.ReadyForPickup)), Times.Once);
            notificationServiceMock.Verify(t=>t.SendPaymentPendingPickupEmailAsync(It.IsAny<DataAccess.Dtos.Payment.PaymentPendingPickupEmailModel>()), Times.Exactly(2));



        }

     }
}

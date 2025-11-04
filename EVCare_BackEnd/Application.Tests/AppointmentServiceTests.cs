using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Services;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using AutoMapper;
using DataAccess.Dtos.Appointment;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Moq;

namespace Application.Tests {
    public class AppointmentServiceTests {
        private readonly IFixture _fixture;
        public AppointmentServiceTests() {

            _fixture = new Fixture()
                .Customize(new AutoMoqCustomization { ConfigureMembers = false });


        }
        [Fact]
        public async Task CreateAppointment_WithAppointmentDateGreaterThanWordEndDay_ShouldThrowException() {

            var serviceCenterRepositoryMock = _fixture.Freeze<Mock<IServiceCenterRepository>>();
            serviceCenterRepositoryMock.Setup(x => x.GetCenterInforAsync())
                .ReturnsAsync(new DataAccess.Entities.ServiceCenter
                {
                    WorkEndDay = DayOfWeek.Friday,
                    WorkStartDay = DayOfWeek.Monday
                });

            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();
            var appointmentCreateModel = _fixture.Build<DataAccess.Dtos.Appointment.AppointmentCreateModel>()
                .With(x => x.Appointment_Date, new DateTime(2024, 6, 8))
                .Create();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                 await appointmentService.CreateAppointment(appointmentCreateModel)
             );
            Assert.Equal($"You must book the appointment from {DayOfWeek.Monday} to {DayOfWeek.Friday} ", result.Message);
        }
        [Fact]
        public async Task CreateAppointment_WithAppointmentDateLessThanWordStartDay_ShouldThrowException() {

            var serviceCenterRepositoryMock = _fixture.Freeze<Mock<IServiceCenterRepository>>();
            serviceCenterRepositoryMock.Setup(x => x.GetCenterInforAsync())
                .ReturnsAsync(new DataAccess.Entities.ServiceCenter
                {
                    WorkEndDay = DayOfWeek.Friday,
                    WorkStartDay = DayOfWeek.Tuesday
                });

            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();
            var appointmentCreateModel = _fixture.Build<DataAccess.Dtos.Appointment.AppointmentCreateModel>()
                .With(x => x.Appointment_Date, new DateTime(2025, 11, 3))
                .Create();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                 await appointmentService.CreateAppointment(appointmentCreateModel)
             );
            Assert.Equal($"You must book the appointment from {DayOfWeek.Tuesday} to {DayOfWeek.Friday} ", result.Message);
        }
        [Fact]
        public async Task CreateAppointment_WithCustomerHaveReachedBookLimit_ThrowsException() {
            var serviceCenterRepositoryMock = _fixture.Freeze<Mock<IServiceCenterRepository>>();
            serviceCenterRepositoryMock.Setup(x => x.GetCenterInforAsync())
                .ReturnsAsync(new DataAccess.Entities.ServiceCenter
                {
                    WorkEndDay = DayOfWeek.Friday,
                    WorkStartDay = DayOfWeek.Monday
                });


            var appointmentCreateModel = _fixture.Build<DataAccess.Dtos.Appointment.AppointmentCreateModel>()
                .With(x => x.Appointment_Date, new DateTime(2025, 11, 3))
                .Create();

            var appointmentService = new Mock<Services.AppointmentService>
            (
               _fixture.Create<IAppointmentRepository>(),
               _fixture.Create<IMapper>(),
               serviceCenterRepositoryMock.Object
            )
            {
                CallBase = true
            };
            appointmentService.Setup(x => x.CheckCustomerCreate(appointmentCreateModel.CustomerId))
                .ReturnsAsync(false);
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                 await appointmentService.Object.CreateAppointment(appointmentCreateModel));
            Assert.Equal("You’ve reached your booking limit.", result.Message);

        }

        [Fact]
        public async Task CreateAppointment_WithBookingDateIsLimit_ThrowsException() {
            var serviceCenterRepositoryMock = _fixture.Freeze<Mock<IServiceCenterRepository>>();
            serviceCenterRepositoryMock.Setup(x => x.GetCenterInforAsync())
                .ReturnsAsync(new DataAccess.Entities.ServiceCenter
                {
                    WorkEndDay = DayOfWeek.Friday,
                    WorkStartDay = DayOfWeek.Monday
                });
            var appointmentCreateModel = _fixture.Build<DataAccess.Dtos.Appointment.AppointmentCreateModel>()
                .With(x => x.Appointment_Date, new DateTime(2025, 11, 3))
                .Create();
            var appointmentService = new Mock<Services.AppointmentService>(
                 _fixture.Create<IAppointmentRepository>(),
               _fixture.Create<IMapper>(),
               serviceCenterRepositoryMock.Object
                )
            {
                CallBase = true
            };
            appointmentService.Setup(x => x.CheckCustomerCreate(appointmentCreateModel.CustomerId))
                .ReturnsAsync(true);
            appointmentService.Setup(x => x.CheckAppointmentsForApointmentDate(appointmentCreateModel.Appointment_Date))
                .ReturnsAsync(false);
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                 await appointmentService.Object.CreateAppointment(appointmentCreateModel));
            Assert.Equal("This day is fully booked", result.Message);
        }

        [Fact]
        public async Task CreateAppointment_WithValidData_ReturnsAppointemtId() {
            var serviceCenterRepositoryMock = _fixture.Freeze<Mock<IServiceCenterRepository>>();
            serviceCenterRepositoryMock.Setup(x => x.GetCenterInforAsync())
                .ReturnsAsync(new DataAccess.Entities.ServiceCenter
                {
                    WorkEndDay = DayOfWeek.Friday,
                    WorkStartDay = DayOfWeek.Monday
                });
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Appointment>()))
               .ReturnsAsync((Appointment a) =>
               {
                   a.Id = 1000;
                   return a;
               });

            var appointmentCreateModel = _fixture.Build<DataAccess.Dtos.Appointment.AppointmentCreateModel>()
                .With(x => x.Appointment_Date, new DateTime(2025, 11, 3))

                .Create();

            var appointmentService = new Mock<Services.AppointmentService>(
                appointmentRepositoryMock.Object,
               _fixture.Create<IMapper>(),
               serviceCenterRepositoryMock.Object
                )
            {
                CallBase = true
            };
            appointmentService.Setup(x => x.CheckCustomerCreate(appointmentCreateModel.CustomerId))
                .ReturnsAsync(true);
            appointmentService.Setup(x => x.CheckAppointmentsForApointmentDate(appointmentCreateModel.Appointment_Date))
                .ReturnsAsync(true);

            var result = await appointmentService.Object.CreateAppointment(appointmentCreateModel);
            Assert.Equal(1000, result);

        }

        [Fact]
        public async Task CheckCustomerCreate_WithValidBookingLimit_ReturnsTrue() {
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.CountAppointmentsPerDay(It.IsAny<int>()))
                .ReturnsAsync(2);
            var serviceCenterRepositoryMock = _fixture.Freeze<Mock<IServiceCenterRepository>>();
            serviceCenterRepositoryMock.Setup(x => x.GetLimitBookingOfServiceCenter())
                .ReturnsAsync(5);
            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();
            var result = await appointmentService.CheckCustomerCreate(It.IsAny<int>());
            Assert.True(result);

        }
        [Fact]
        public async Task CheckCustomerCreate_WithInValidBookingLimit_ReturnsTrue() {
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.CountAppointmentsPerDay(It.IsAny<int>()))
                .ReturnsAsync(2);
            var serviceCenterRepositoryMock = _fixture.Freeze<Mock<IServiceCenterRepository>>();
            serviceCenterRepositoryMock.Setup(x => x.GetLimitBookingOfServiceCenter())
                .ReturnsAsync(1);
            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();
            var result = await appointmentService.CheckCustomerCreate(It.IsAny<int>());
            Assert.False(result);

        }

        [Theory, AutoData]
        public async Task CheckAppointmentsForApointmentDate_WithAvailableSlot_ReturnsTrue(DateTime appointmentDate) {
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.CountAppointment(DateOnly.FromDateTime(appointmentDate)))
                .ReturnsAsync(2);
            var serviceCenterRepositoryMock = _fixture.Freeze<Mock<IServiceCenterRepository>>();
            serviceCenterRepositoryMock.Setup(x => x.GetAppactityOfServiceCenter())
                .ReturnsAsync(5);
            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();
            var result = await appointmentService.CheckAppointmentsForApointmentDate(appointmentDate);
            Assert.True(result);
        }
        [Theory, AutoData]
        public async Task CheckAppointmentsForApointmentDate_WithUnavailableSlot_ReturnsTrue(DateTime appointmentDate) {
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.CountAppointment(DateOnly.FromDateTime(appointmentDate)))
                .ReturnsAsync(9);
            var serviceCenterRepositoryMock = _fixture.Freeze<Mock<IServiceCenterRepository>>();
            serviceCenterRepositoryMock.Setup(x => x.GetAppactityOfServiceCenter())
                .ReturnsAsync(5);
            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();
            var result = await appointmentService.CheckAppointmentsForApointmentDate(appointmentDate);
            Assert.False(result);
        }

        [Theory, AutoData]
        public async Task GetAppointmentById_WithExitsID_ReturnsAppointment(int appointmentId) {
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.GetAppointmentWithDetails(appointmentId))
                .ReturnsAsync(new DataAccess.Dtos.Appointment.AppointmentViewDetailModel
                {
                    Id = appointmentId
                });
            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();
            var result = await appointmentService.GetAppointmentById(appointmentId);
            Assert.NotNull(result);
            Assert.Equal(appointmentId, result.Id);

        }
        [Theory, AutoData]
        public async Task GetAppointmentById_WithNonExitsID_ThrowsException(int appointmentId) {
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.GetAppointmentWithDetails(appointmentId))
                .ReturnsAsync(() => null);
            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                 await appointmentService.GetAppointmentById(appointmentId)
             );
            Assert.Equal("Appointment not found", result.Message);

        }

        [Theory, AutoData]
        public async Task UpdateAppointment_WithNonExistAppointment_ThrowsException(
            AppointmentUpdateModel model, int employeeId) {
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(() => null);
            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();

            var result = await Assert.ThrowsAsync<Exception>(async () =>
                 await appointmentService.UpdateAppointment(model, It.IsAny<int>())
             );
            Assert.Equal("Appointment not found", result.Message);
        }
        [Theory, AutoData]
        public async Task UpdateAppointment_WithAppointmentIsDone_ThrowsException(
           AppointmentUpdateModel model, int employeeId) {
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Appointment
                {
                    Status = DataAccess.Enums.AppointmentStatusEnum.Done
                });
            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();

            var result = await Assert.ThrowsAsync<Exception>(async () =>
                 await appointmentService.UpdateAppointment(model, It.IsAny<int>())
             );
            Assert.Equal("Cannot update status of completed or canceled appointment", result.Message);
        }
        [Theory, AutoData]
        public async Task UpdateAppointment_WithAppointmentIsCanncel_ThrowsException(
         AppointmentUpdateModel model, int employeeId) {
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Appointment
                {
                    Status = DataAccess.Enums.AppointmentStatusEnum.Canceled
                });
            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();

            var result = await Assert.ThrowsAsync<Exception>(async () =>
                 await appointmentService.UpdateAppointment(model, It.IsAny<int>())
             );
            Assert.Equal("Cannot update status of completed or canceled appointment", result.Message);
        }
        [Theory, AutoData]
        public async Task UpdateAppointment_WithStatusCheckInNotAppointmentDate_ThrowsException(
            AppointmentUpdateModel model, int employeeId) {
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            model.Status = DataAccess.Enums.AppointmentStatusEnum.CheckedIn;
            appointmentRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Appointment
                {
                    Status = DataAccess.Enums.AppointmentStatusEnum.Confirmed,
                    Appointment_Date = DateTime.Now.AddDays(1)
                });
            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                 await appointmentService.UpdateAppointment(model, It.IsAny<int>())
             );
            Assert.Equal("Can only check-in on the day of the appointment", result.Message);


        }

        [Theory, AutoData]
        public async Task UpdateAppointment_WithValidData_ReturnsTrue(
           AppointmentUpdateModel model, int employeeId) {
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Appointment
                {
                    Status = DataAccess.Enums.AppointmentStatusEnum.CheckedIn,
                    Appointment_Date = DateTime.Now
                });
            var appointmentService = _fixture.Create<Application.Services.AppointmentService>();
            var result = await appointmentService.UpdateAppointment(model, It.IsAny<int>());    
            Assert.True(result);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Services;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using AutoMapper;
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
           var result =  await Assert.ThrowsAsync<Exception>(async () => 
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
               _fixture.Create<IAppointmentRepository>()    ,
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
                .With(x => x.Appointment_Date, new DateTime(2025, 11,3))
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

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Dtos.Appointment;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.Payment;
using DataAccess.Dtos.Vehicle;

namespace Application.Tests {
    public class NotificationServiceTests {
        private readonly IFixture _fixture;
        public NotificationServiceTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false});
        }

        [Fact]
        public void GenerateVerificationCode_ShouldReturn6DigitCode() {
            var notificationService = _fixture.Create<Application.Services.NotificationServices>();
            var code = notificationService.GenerateVerificationCode();
            Assert.NotNull(code);
            Assert.Equal(6, code.Length);
            Assert.True(code.All(char.IsDigit));
        }
        [Theory,AutoData]
        public async Task SendOTP_ShouldSendOtpAndSaveIt(string email, int expires) {
            var otpServicesMock = new Moq.Mock<IOtpServices>();
            otpServicesMock.Setup(o => o.SaveOtpAsync(Moq.It.IsAny<string>(), Moq.It.IsAny<string>(), Moq.It.IsAny<int>()))
                .Returns(Task.CompletedTask)
                .Verifiable();
            _fixture.Inject(otpServicesMock.Object);
            var configurationMock = new Moq.Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            configurationMock.Setup(c => c["NotificationAPI:key01"]).Returns("test_key01");
            configurationMock.Setup(c => c["NotificationAPI:key02"]).Returns("test_key02");
            _fixture.Inject(configurationMock.Object);
            var notificationService = _fixture.Create<Application.Services.NotificationServices>();
            var otp = await notificationService.SendOTP(email, expires);
            Assert.NotNull(otp);
            Assert.Equal(6, otp.Length);
            Assert.True(otp.All(char.IsDigit));
            otpServicesMock.Verify(o => o.SaveOtpAsync(email, otp, expires), Moq.Times.Once);
        }
        [Theory,AutoData]
        public async Task SendAppointmentInforAsync_ShouldSendNotification(
            AppointmentViewDetailModel rawData) {
            var configurationMock = new Moq.Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            configurationMock.Setup(c => c["NotificationAPI:key01"]).Returns("test_key01");
            configurationMock.Setup(c => c["NotificationAPI:key02"]).Returns("test_key02");
            _fixture.Inject(configurationMock.Object);
            var mapperMock = new Moq.Mock<AutoMapper.IMapper>();
            mapperMock.Setup(m => m.Map<AppointmentInforToSentDto>(Moq.It.IsAny<AppointmentViewDetailModel>()))
               .Returns(new AppointmentInforToSentDto
               {
                   AppointmentDate = rawData.AppointmentDate,
                   CenterAddress = "Test Address",
                   CenterName = "Test Center",
                   ConfirmUrl = "http://confirm.url",
                   CancelUrl = "http://cancel.url",
                   customerId = 1,

               });
            _fixture.Inject(mapperMock.Object);
            var linkServicesMock = new Moq.Mock<ILinkServices>();
            linkServicesMock.Setup(l => l.GenerateActionLinks(Moq.It.IsAny<int>(), Moq.It.IsAny<int>()))
                .Returns(("http://confirm.url", "http://cancel.url"));
            _fixture.Inject(linkServicesMock.Object);
            var notificationService = _fixture.Create<Application.Services.NotificationServices>();
            await notificationService.SendAppointmentInforAsync(rawData);

            configurationMock.Verify(c => c["NotificationAPI:key01"], Moq.Times.Once);
            configurationMock.Verify(c => c["NotificationAPI:key02"], Moq.Times.Once);  
            mapperMock.Verify(m => m.Map<AppointmentInforToSentDto>(Moq.It.IsAny<AppointmentViewDetailModel>()), Moq.Times.Once);
            linkServicesMock.Verify(l => l.GenerateActionLinks(rawData.Id, Moq.It.IsAny<int>()), Moq.Times.Once);
        }

        [Theory,AutoData]
        public async Task SendInvoiceToCustomer_ShouldSendNotification(
            InvoiceMailDto rawData) {
            var configurationMock = new Moq.Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            configurationMock.Setup(c => c["NotificationAPI:key01"]).Returns("test_key01");
            configurationMock.Setup(c => c["NotificationAPI:key02"]).Returns("test_key02");
            _fixture.Inject(configurationMock.Object);
           
            var notificationService = _fixture.Create<Application.Services.NotificationServices>();
            await notificationService.SendInvoiceToCustomer(rawData);
            configurationMock.Verify(c => c["NotificationAPI:key01"], Moq.Times.Once);
            configurationMock.Verify(c => c["NotificationAPI:key02"], Moq.Times.Once);  
           
        }
        [Theory,AutoData]
        public async Task SendEmailToRemider_ShouldSendNotification(
            VehicleReminderDto model) {
            var configurationMock = new Moq.Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            configurationMock.Setup(c => c["NotificationAPI:key03"]).Returns("test_key01");
            configurationMock.Setup(c => c["NotificationAPI:key04"]).Returns("test_key02");
            _fixture.Inject(configurationMock.Object);
           
            var notificationService = _fixture.Create<Application.Services.NotificationServices>();
            await notificationService.SendEmailToRemider(model);
            configurationMock.Verify(c => c["NotificationAPI:key03"], Moq.Times.Once);
            configurationMock.Verify(c => c["NotificationAPI:key04"], Moq.Times.Once);

        }
        [Theory,AutoData]
        public async Task SendPaymentPendingPickupEmailAsync_ShouldSendNotification(
            PaymentPendingPickupEmailModel rawData) {
            var configurationMock = new Moq.Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            configurationMock.Setup(c => c["NotificationAPI:key03"]).Returns("test_key01");
            configurationMock.Setup(c => c["NotificationAPI:key04"]).Returns("test_key02");
            _fixture.Inject(configurationMock.Object);
           
           
            var notificationService = _fixture.Create<Application.Services.NotificationServices>();
            await notificationService.SendPaymentPendingPickupEmailAsync(rawData);
            configurationMock.Verify(c => c["NotificationAPI:key03"], Moq.Times.Once);
            configurationMock.Verify(c => c["NotificationAPI:key04"], Moq.Times.Once);  


        }


    }
}

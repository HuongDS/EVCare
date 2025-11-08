using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Dtos.Invoice;
using DocumentFormat.OpenXml.Vml.Spreadsheet;
using Microsoft.Extensions.Configuration;
using Moq;

namespace Application.Tests {
    public class PayOSServiceTests {
        private readonly IFixture _fixture;
        public PayOSServiceTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Theory,AutoData]
        public async Task CreateCheckoutUrlAsync_WithError_ThrowsException(InvoiceCreateModel model) {

            var configRepositoryMock = new Moq.Mock<IConfiguration>();
            configRepositoryMock.Setup(c => c["PayOS:ReturnUrl"])
                .Returns("return_api");
            configRepositoryMock.Setup(c => c["PayOS:CancelUrl"])
                .Returns("cancel_api");
            _fixture.Inject(configRepositoryMock.Object);
            var gatewayService = new Mock<IPayOSGateWay>();
            gatewayService.Setup(g => g.CreateAsync(
             It.IsAny<long>(), It.IsAny<long>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync((false, null, "error"));
            _fixture.Inject(gatewayService.Object);
            var payOSService = _fixture.Create<Application.Services.PayOSService>();
            var result = await Assert.ThrowsAsync<Exception>(async () => await payOSService.CreateCheckoutUrlAsync(model));
            Assert.Equal("PayOS create failed: error", result.Message);


        }
        [Theory, AutoData]
        public async Task CreateCheckoutUrlAsync_WithUrlIsNull_ThrowsException(InvoiceCreateModel model) {

            var configRepositoryMock = new Moq.Mock<IConfiguration>();
            configRepositoryMock.Setup(c => c["PayOS:ReturnUrl"])
                .Returns("return_api");
            configRepositoryMock.Setup(c => c["PayOS:CancelUrl"])
                .Returns("cancel_api");
            _fixture.Inject(configRepositoryMock.Object);
            var gatewayService = new Mock<IPayOSGateWay>();
            gatewayService.Setup(g => g.CreateAsync(
             It.IsAny<long>(), It.IsAny<long>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync((true, null, "error"));
            _fixture.Inject(gatewayService.Object);
            var payOSService = _fixture.Create<Application.Services.PayOSService>();
            var result = await Assert.ThrowsAsync<Exception>(async () => await payOSService.CreateCheckoutUrlAsync(model));
            Assert.Equal("PayOS create failed: url is null", result.Message);


        }
        [Theory, AutoData]
        public async Task CreateCheckoutUrlAsync_WithValidData_ReturnsUrlAndOrderCode(InvoiceCreateModel model) {

            var configRepositoryMock = new Moq.Mock<IConfiguration>();
            configRepositoryMock.Setup(c => c["PayOS:ReturnUrl"])
                .Returns("return_api");
            configRepositoryMock.Setup(c => c["PayOS:CancelUrl"])
                .Returns("cancel_api");
            _fixture.Inject(configRepositoryMock.Object);
            var gatewayService = new Mock<IPayOSGateWay>();
            gatewayService.Setup(g => g.CreateAsync(
             It.IsAny<long>(), It.IsAny<long>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync((true, "day la url", "abc"));
            _fixture.Inject(gatewayService.Object);
            var payOSService = _fixture.Create<Application.Services.PayOSService>();
            var result = await payOSService.CreateCheckoutUrlAsync(model);
            Assert.Equal("day la url", result.Item1);
        }

    }
}

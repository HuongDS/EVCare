using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Hubs;
using Application.DomainEvents;
using Application.Interfaces;
using Application.Services;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Dtos.Invoice;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Application.Tests {
    public class InvoiceServiceTests {
        private readonly IFixture _fixture;
        public InvoiceServiceTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Fact]
        public async Task CreatePaymentInvoice_WithVaildData_AddInvoiceSuccessfully() {

            var orderRepositoryMock = _fixture.Freeze<Mock<IOrderRepository>>();

            orderRepositoryMock.Setup(o => o.GetCustomerIdByOrderId(It.IsAny<int>()))
                .ReturnsAsync(5);
            var mapperMock = _fixture.Freeze<Mock<AutoMapper.IMapper>>();
            mapperMock.Setup(m => m.Map<DataAccess.Entities.Invoice>(It.IsAny<InvoiceCreateModel>()))
                .Returns(new Invoice
                {
                    Id = 1000,
                    CustomerId = 5,
                    OrderId = 1,
                    Total_Price = 100,

                    Create_At = DateTime.Now,
                    Updated_At = DateTime.Now
                });
            orderRepositoryMock.Setup(o => o.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Order
                {
                    Id = 1,

                });
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(a => a.GetAppointmentByOrderIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Appointment { });
            appointmentRepositoryMock.Setup(a => a.AddAsync(It.IsAny<DataAccess.Entities.Appointment>()))
                .ReturnsAsync(new Appointment
                {
                    Id = 2000,
                    OrderId = 1,

                });
            var invoiceRepositoryMock = _fixture.Freeze<Mock<IInvoiceRepository>>();
            invoiceRepositoryMock.Setup(i => i.AddAsync(It.IsAny<DataAccess.Entities.Invoice>()))
                .ReturnsAsync((Invoice x) =>
                {
                    x.Id = 1000;
                    return x.Id;
                });


            var handlerMock = _fixture.Freeze<Mock<OnInvoiceCompleteHandler>>();
            handlerMock.Setup(h => h.HandleAsync()).Returns(Task.CompletedTask);
            _fixture.Inject(handlerMock.Object);
            var invoiceService = _fixture.Create<Application.Services.InvoiceService>();
            var defaultContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            var result = await invoiceService.CreateInvoice(_fixture.Create<InvoiceCreateModel>());
            Assert.NotNull(result);
            Assert.Equal(1000, result);
        }

        [Fact]
        public async Task CreatePaymentUrl_WithValidData_ReturnsURL() {
            var orderRepositoryMock = _fixture.Freeze<Mock<IOrderRepository>>();

            orderRepositoryMock.Setup(o => o.GetCustomerIdByOrderId(It.IsAny<int>()))
                .ReturnsAsync(5);
            var mapperMock = _fixture.Freeze<Mock<AutoMapper.IMapper>>();
            mapperMock.Setup(m => m.Map<DataAccess.Entities.Invoice>(It.IsAny<InvoiceCreateModel>()))
                .Returns(new Invoice
                {
                    Id = 1000,
                    CustomerId = 5,
                    OrderId = 1,
                    Total_Price = 100,

                    Create_At = DateTime.Now,
                    Updated_At = DateTime.Now
                });
            var redisServiceMock = _fixture.Freeze<Mock<Application.Interfaces.IRedisService>>();
            redisServiceMock.Setup(r => r.SaveDate(It.IsAny<Invoice>(), It.IsAny<string>()))
                .Returns(Task.CompletedTask);
            var vnpayServiceMock = _fixture.Freeze<Mock<Application.Interfaces.IVnPayService>>();
            var defaultContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            vnpayServiceMock
                .Setup(v => v.CreatePaymentUrl(defaultContext, It.IsAny<InvoiceCreateModel>(), It.IsAny<long>()))
                .Returns("https://pay.vnpay.vn/123456789");
            var invoiceService = _fixture.Create<Application.Services.InvoiceService>();
            var result = await invoiceService.CreatePaymentUrl(defaultContext, _fixture.Create<InvoiceCreateModel>());
            Assert.NotNull(result);
            Assert.Equal("https://pay.vnpay.vn/123456789", result);


        }

        [Fact]
        public async Task CreatePayOSUrl_WithExistInvoice_ThrowsException() {
            var invoiceRepositoryMock = _fixture.Freeze<Mock<IInvoiceRepository>>();
            invoiceRepositoryMock.Setup(i => i.GetInvoiceByOrderId(It.IsAny<int>()))
                .ReturnsAsync(new Invoice
                {
                    OrderId = 1,
                });
            var invoiceService = _fixture.Create<Application.Services.InvoiceService>();
            var model = new InvoiceCreateModel
            {
                OrderId = 1,
                Payment_Method = DataAccess.Enums.PaymentMethodEnum.PayOs
            };
            var result = await Assert.ThrowsAsync<Exception>(async () =>
              {
                  await invoiceService.CreatePayOSUrl(model);
              });
            Assert.Equal("Order has existed", result.Message);

        }

        [Fact]
        public async Task CreatePayOSUrl_WithValidData_ReturnsURL() {
            var invoiceRepositoryMock = _fixture.Freeze<Mock<IInvoiceRepository>>();
            invoiceRepositoryMock.Setup(i => i.GetInvoiceByOrderId(It.IsAny<int>()))
                .ReturnsAsync((Invoice?)null);
            var mapperMock = _fixture.Freeze<Mock<AutoMapper.IMapper>>();
            mapperMock.Setup(m => m.Map<DataAccess.Entities.Invoice>(It.IsAny<InvoiceCreateModel>()))
                .Returns(new Invoice
                {
                    Id = 1000,
                    CustomerId = 5,
                    OrderId = 1,
                    Total_Price = 100,
                    Create_At = DateTime.Now,
                    Updated_At = DateTime.Now
                });
            var orderRepositoryMock = _fixture.Freeze<Mock<IOrderRepository>>();
            orderRepositoryMock.Setup(o => o.GetCustomerIdByOrderId(It.IsAny<int>()))
                .ReturnsAsync(5);
            orderRepositoryMock.Setup(o => o.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Order
                {
                    Id = 1,
                });
            var payOsServiceMock = _fixture.Freeze<Mock<Application.Interfaces.IPayOSService>>();
            payOsServiceMock.Setup(p => p.CreateCheckoutUrlAsync(It.IsAny<InvoiceCreateModel>()))
                .ReturnsAsync(("https://payos.vn/pay/abcdefg123456", 123));
            var invoiceRepoMock = _fixture.Freeze<Mock<IInvoiceRepository>>();
            invoiceRepoMock.Setup(i => i.AddAsync(It.IsAny<Invoice>()))
                .ReturnsAsync(1000);
            var invoiceService = _fixture.Create<Application.Services.InvoiceService>();
            var result = await invoiceService.CreatePayOSUrl(new InvoiceCreateModel
            {
                OrderId = 1,
                Payment_Method = DataAccess.Enums.PaymentMethodEnum.PayOs
            });
            Assert.NotNull(result);
            Assert.Contains("https://payos.vn/pay/", result);
        }

        [Fact]
        public async Task PaymentCallback_WhenPaymentExecuteIsNull_ThrowsException() {
            var query = new QueryCollection();
            var vnPayServiceMock = _fixture.Freeze<Mock<IVnPayService>>();
            vnPayServiceMock.Setup(t => t.PaymentExecute(query)).Returns(() => null);
            var invoiceService = _fixture.Create<InvoiceService>();
            var result = await Assert.ThrowsAsync<Exception>(
                  async () => await invoiceService.PaymentCallback(query));

            Assert.Equal("Payment failed or invalid response", result.Message);


        }
        [Fact]
        public async Task PaymentCallback_WhenPaymentExecuteInvalidVnPayResponseCode_ThrowsException() {
            var query = new QueryCollection();
            var vnPayServiceMock = _fixture.Freeze<Mock<IVnPayService>>();
            vnPayServiceMock.Setup(t => t.PaymentExecute(query)).Returns(new DataAccess.Dtos.VnPay.VnPaymentResponseModel
            {
                VnPayResponseCode = "abc"
            });
            var invoiceService = _fixture.Create<InvoiceService>();
            var result = await Assert.ThrowsAsync<Exception>(
                  async () => await invoiceService.PaymentCallback(query));

            Assert.Equal("Payment failed or invalid response", result.Message);


        }


        [Fact]
        public async Task PaymentCallback_WhenInvoiceIsNull_ThrowsException() {
            var query = new QueryCollection();
            var vnPayServiceMock = _fixture.Freeze<Mock<IVnPayService>>();
            vnPayServiceMock.Setup(t => t.PaymentExecute(query)).Returns(new DataAccess.Dtos.VnPay.VnPaymentResponseModel
            {
                VnPayResponseCode = "00",
                OrderCode = 50
            });
            var redisServiceMock = new Mock<IRedisService>();
            redisServiceMock.Setup(r => r.GetObjectData<Invoice>(It.IsAny<string>()))
                .ReturnsAsync((Invoice)null);

            _fixture.Inject(redisServiceMock.Object);
            var invoiceService = _fixture.Create<InvoiceService>();
            var result = await Assert.ThrowsAsync<Exception>(
                  async () => await invoiceService.PaymentCallback(query));
            Assert.Equal("Invoice not found", result.Message);
        }

        [Fact]
        public async Task PaymentCallback_WhenAllValid_AddInvoiceSuccessfully() {
            var query = new QueryCollection();
            var vnPayServiceMock = _fixture.Freeze<Mock<IVnPayService>>();
            vnPayServiceMock.Setup(t => t.PaymentExecute(query)).Returns(new DataAccess.Dtos.VnPay.VnPaymentResponseModel
            {
                VnPayResponseCode = "00",
                OrderCode = 50
            });
            var redisServiceMock = new Mock<IRedisService>();
            redisServiceMock.Setup(r => r.GetObjectData<Invoice>(It.IsAny<string>()))
                .ReturnsAsync(new Invoice
                {
                    Id = 1000,
                    OrderId = 50,
                    CustomerId = 5,
                    Total_Price = 200,
                });
            _fixture.Inject(redisServiceMock.Object);
            var invoiceRepositoryMock = new Mock<IInvoiceRepository>();
            invoiceRepositoryMock.Setup(i => i.AddAsync(It.IsAny<Invoice>()))
                .ReturnsAsync(1000);
            _fixture.Inject(invoiceRepositoryMock.Object);
            var orderRepositoryMock = new Mock<IOrderRepository>();
            orderRepositoryMock.Setup(o => o.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Order
                {
                    Id = 50,
                });
            _fixture.Inject(orderRepositoryMock.Object);
            orderRepositoryMock.Setup(o=>o.UpdateAsync(It.IsAny<Order>()))
                .ReturnsAsync(new Order
                {
                    Id = 50,
                });
            _fixture.Inject(orderRepositoryMock.Object);
            var appointmentRepositoryMock = new Mock<IAppointmentRepository>();
            appointmentRepositoryMock.Setup(a => a.GetAppointmentByOrderIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Appointment { });
            appointmentRepositoryMock.Setup(a => a.UpdateAsync(It.IsAny<DataAccess.Entities.Appointment>()))
                .ReturnsAsync(new Appointment
                {
                    Id = 2000,
                    OrderId = 50,
                });
            var handlerMock = new Mock<OnInvoiceCompleteHandler>(MockBehavior.Loose, null, null, null);
            handlerMock.Setup(h => h.HandleAsync()).Returns(Task.CompletedTask);
            _fixture.Inject(handlerMock.Object);
            var invoiceService = _fixture.Create<InvoiceService>();
            await invoiceService.PaymentCallback(query);
            handlerMock.Verify(h => h.HandleAsync(), Times.Once);



        }

        [Fact]
        public async Task HandleWebhook_InvalidSignature_Returns_NoSideEffects(){
            var gw = new Mock<IPayOSGateWay>();
            gw.Setup(g => g.Verify(It.IsAny<string>(), It.IsAny<string>())).Returns(false);

            _fixture.Inject(gw.Object); 

            var svc = _fixture.Create<InvoiceService>();
            await svc.HandleWebhookAsync("{}", "sig");

            gw.Verify(g => g.Verify(It.IsAny<string>(), It.IsAny<string>()), Times.Once);

        }
        [Fact]
        public async Task HandleWebhook_MissingOrderCode_Returns_NoSideEffects() {
            var gw = _fixture.Freeze<Mock<IPayOSGateWay>>();
            gw.Setup(g => g.Verify(It.IsAny<string>(), It.IsAny<string>())).Returns(true);
            var redis = _fixture.Freeze<Mock<IRedisService>>();
            var raw = "{\"data\":{\"code\":\"00\",\"desc\":\"success\"}}";
            var svc = _fixture.Create<InvoiceService>();
            await svc.HandleWebhookAsync(raw, "sig");
            redis.Verify(r => r.GetObjectData<Invoice>(It.IsAny<string>()), Times.Never);
        }
        [Fact]
        public async Task HandleWebhook_InvoiceMissingInRedis_Returns_NoSideEffects() {
            var gw = _fixture.Freeze<Mock<IPayOSGateWay>>();
            gw.Setup(g => g.Verify(It.IsAny<string>(), It.IsAny<string>())).Returns(true);
            var redis = _fixture.Freeze<Mock<IRedisService>>();
            redis.Setup(r => r.GetObjectData<Invoice>("123")).ReturnsAsync((Invoice)null);
            var raw = "{\"data\":{\"orderCode\":123,\"code\":\"00\",\"desc\":\"success\"}}";
            var svc = _fixture.Create<InvoiceService>();
            await svc.HandleWebhookAsync(raw, "sig");
            redis.Verify(r => r.GetObjectData<Invoice>("123"), Times.Once);
        }

        [Fact]
        public async Task HandleWebhook_Success_ByCode00_PerformsSideEffects() {
            long code = 777;
            var raw = $"{{\"data\":{{\"orderCode\":{code},\"code\":\"00\",\"desc\":\"ok\"}}}}";
            var gw = _fixture.Freeze<Mock<IPayOSGateWay>>();
            gw.Setup(g => g.Verify(raw, "sig")).Returns(true);
            var redis = _fixture.Freeze<Mock<IRedisService>>();
            redis.Setup(r => r.GetObjectData<Invoice>(code.ToString()))
                 .ReturnsAsync(new Invoice { Id = 10, OrderId = 55 });
            var orderRepo = _fixture.Freeze<Mock<IOrderRepository>>();
            orderRepo.Setup(o => o.GetByIdAsync(55)).ReturnsAsync(new Order { Id = 55 });
            var apptRepo = _fixture.Freeze<Mock<IAppointmentRepository>>();
            apptRepo.Setup(a => a.GetAppointmentByOrderIdAsync(55)).ReturnsAsync(new Appointment());
            var invRepo = _fixture.Freeze<Mock<IInvoiceRepository>>();
            invRepo.Setup(i => i.AddAsync(It.IsAny<Invoice>())).ReturnsAsync(999);
            var handler = new Mock<OnInvoiceCompleteHandler>(MockBehavior.Loose, null, null, null); 
            handler.Setup(h => h.HandleAsync()).Returns(Task.CompletedTask);
            _fixture.Inject(handler.Object);
            var svc = _fixture.Create<InvoiceService>();
            await svc.HandleWebhookAsync(raw, "sig");
            invRepo.Verify(i => i.AddAsync(It.IsAny<Invoice>()), Times.Once);
            handler.Verify(h => h.HandleAsync(), Times.Once);
        }
        [Fact]
        public async Task HandleWebhook_Success_ByDesc_ReturnsSideEffects() {
            long code = 888;
            var raw = $"{{\"data\":{{\"orderCode\":{code},\"code\":\"xx\",\"desc\":\"SUCCESS\"}}}}";
            var gw = _fixture.Freeze<Mock<IPayOSGateWay>>();
            gw.Setup(g => g.Verify(raw, "sig")).Returns(true);
            var redis = _fixture.Freeze<Mock<IRedisService>>();
            redis.Setup(r => r.GetObjectData<Invoice>(code.ToString()))
                 .ReturnsAsync(new Invoice { Id = 10, OrderId = 55 });
            var invRepo = _fixture.Freeze<Mock<IInvoiceRepository>>();
            invRepo.Setup(i => i.AddAsync(It.IsAny<Invoice>())).ReturnsAsync(200);
            var svc = _fixture.Create<InvoiceService>();
            await svc.HandleWebhookAsync(raw, "sig");

            invRepo.Verify(i => i.AddAsync(It.IsAny<Invoice>()), Times.Once);
        }
        [Fact]
        public async Task HandleWebhook_NotSuccess_NoSideEffects() {
            long code = 999;
            var raw = $"{{\"data\":{{\"orderCode\":{code},\"code\":\"24\",\"desc\":\"FAILED\"}}}}";

            var gw = _fixture.Freeze<Mock<IPayOSGateWay>>();
            gw.Setup(g => g.Verify(raw, "sig")).Returns(true);

            var redis = _fixture.Freeze<Mock<IRedisService>>();
            redis.Setup(r => r.GetObjectData<Invoice>(code.ToString()))
                 .ReturnsAsync(new Invoice { Id = 10, OrderId = 55 });

            var invRepo = _fixture.Freeze<Mock<IInvoiceRepository>>();

            var svc = _fixture.Create<InvoiceService>();
            await svc.HandleWebhookAsync(raw, "sig");

            invRepo.Verify(i => i.AddAsync(It.IsAny<Invoice>()), Times.Never);
        }
    }
}

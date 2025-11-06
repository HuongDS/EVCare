using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Hubs;
using Application.DomainEvents;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Dtos.Invoice;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Moq;

namespace Application.Tests {
    public class InvoiceServiceTests {
        private readonly IFixture _fixture;
        public InvoiceServiceTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false});
        }
        [Fact]
        public async Task CreatePaymentInvoice_WithVaildData_AddInvoiceSuccessfully() {
            
            var orderRepositoryMock = _fixture.Freeze<Mock<IOrderRepository>>();
            
            orderRepositoryMock.Setup(o=>o.GetCustomerIdByOrderId(It.IsAny<int>()))
                .ReturnsAsync(5);
            var mapperMock = _fixture.Freeze<Mock<AutoMapper.IMapper>>();
            mapperMock.Setup(m=>m.Map<DataAccess.Entities.Invoice>(It.IsAny<InvoiceCreateModel>()))
                .Returns(new Invoice
                {
                    Id=1000,
                    CustomerId=5,
                    OrderId=1,
                    Total_Price=100,
                   
                    Create_At=DateTime.Now,
                    Updated_At=DateTime.Now
                });
            orderRepositoryMock.Setup(o=>o.GetByIdAsync(It.IsAny<int>()))       
                .ReturnsAsync(new Order
                {
                    Id=1,
                    
                });
            var appointmentRepositoryMock = _fixture.Freeze<Mock<IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(a=>a.GetAppointmentByOrderIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Appointment { });
            appointmentRepositoryMock.Setup(a=>a.AddAsync(It.IsAny<DataAccess.Entities.Appointment>()))
                .ReturnsAsync(new Appointment
                {
                    Id= 2000,
                    OrderId= 1,
                   
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
            var result =  await invoiceService.CreateInvoice(_fixture.Create<InvoiceCreateModel>());
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
                .Setup(v => v.CreatePaymentUrl(defaultContext,It.IsAny<InvoiceCreateModel>(),It.IsAny<long>()))
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
          var result =  await Assert.ThrowsAsync<Exception>(async () =>
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
                .ReturnsAsync(("https://payos.vn/pay/abcdefg123456",123));
            var invoiceRepoMock = _fixture.Freeze<Mock<IInvoiceRepository>>();
            invoiceRepoMock.Setup(i => i.AddAsync(It.IsAny<Invoice>()))
                .ReturnsAsync(1000);
            var invoiceService = _fixture.Create<Application.Services.InvoiceService>();
            var result = await invoiceService.CreatePayOSUrl( new InvoiceCreateModel
            {
                OrderId = 1,
                Payment_Method = DataAccess.Enums.PaymentMethodEnum.PayOs
            });
            Assert.NotNull(result);
            Assert.Contains("https://payos.vn/pay/", result);
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.Orders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Moq;

namespace Api.Tests {
    public class ValidateInvoiceTotalFilterTests {
        private readonly IFixture _fixture;
        public ValidateInvoiceTotalFilterTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Fact]
        public async Task OnActionExecutionAsync_InvoiceTotalMatchesOrderTotal_ShouldCallNext() {


            var httpContext = new DefaultHttpContext();
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var invoiceCreateModel = new InvoiceCreateModel
            {
                OrderId = 1,
                Total_Price = 100.00m
            };
            var orderRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderRepository>>();
            orderRepositoryMock.Setup(o => o.GetOrderDetailAsync(invoiceCreateModel.OrderId))
                .ReturnsAsync(new OrderViewModel
                {
                    Id = 1,
                    Price = 100.00m

                });
            _fixture.Inject(orderRepositoryMock.Object);

            var filter = _fixture.Create<API.Filters.ValidateInvoiceTotalFilter>();
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "dto", invoiceCreateModel }
                },
                controller: null
            );
            bool nextCalled = false;
            ActionExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult<ActionExecutedContext>(null);
            };
            // Act
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            // Assert
            Assert.True(nextCalled);

        }
        [Fact]
        public async Task OnActionExecutionAsync_InvoiceTotalDoesNotMatchOrderTotal_ShouldSetBadRequestResult() {
            var httpContext = new DefaultHttpContext();
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var invoiceCreateModel = new InvoiceCreateModel
            {
                OrderId = 1,
                Total_Price = 150.00m
            };
            var orderRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderRepository>>();
            orderRepositoryMock.Setup(o => o.GetOrderDetailAsync(invoiceCreateModel.OrderId))
                .ReturnsAsync(new OrderViewModel
                {
                    Id = 1,
                    Price = 100.00m
                });
            _fixture.Inject(orderRepositoryMock.Object);
            var filter = _fixture.Create<API.Filters.ValidateInvoiceTotalFilter>();
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "dto", invoiceCreateModel }
                },
                controller: null
            );
            ActionExecutionDelegate next = () =>
            {
                return Task.FromResult<ActionExecutedContext>(null);
            };

            await filter.OnActionExecutionAsync(actionExecutingContext, next);

            Assert.NotNull(actionExecutingContext.Result);
            var badRequestResult = Assert.IsType<Microsoft.AspNetCore.Mvc.BadRequestObjectResult>(actionExecutingContext.Result);
            Assert.Equal(400, badRequestResult.StatusCode);
        }
        [Fact]
        public async Task OnActionExecutionAsync_OrderNotFound_ShouldSetNotFoundResult() {
            var httpContext = new DefaultHttpContext();
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var invoiceCreateModel = new InvoiceCreateModel
            {
                OrderId = 1,
                Total_Price = 100.00m
            };
            var orderRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderRepository>>();
            orderRepositoryMock.Setup(o => o.GetOrderDetailAsync(invoiceCreateModel.OrderId))
                .ReturnsAsync((OrderViewModel)null);
            _fixture.Inject(orderRepositoryMock.Object);
            var filter = _fixture.Create<API.Filters.ValidateInvoiceTotalFilter>();
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "dto", invoiceCreateModel }
                },
                controller: null
            );
            ActionExecutionDelegate next = () =>
            {
                return Task.FromResult<ActionExecutedContext>(null);
            };

            await filter.OnActionExecutionAsync(actionExecutingContext, next);

            Assert.NotNull(actionExecutingContext.Result);
            var notFoundResult = Assert.IsType<Microsoft.AspNetCore.Mvc.NotFoundObjectResult>(actionExecutingContext.Result);
            Assert.Equal(404, notFoundResult.StatusCode);

        }
        [Fact]
        public async Task OnActionExecutionAsync_DtoIsNull_ShouldSetBadRequestResult() {
            var httpContext = new DefaultHttpContext();
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var orderRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderRepository>>();
            _fixture.Inject(orderRepositoryMock.Object);
            var filter = _fixture.Create<API.Filters.ValidateInvoiceTotalFilter>();
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    
                },
                controller: null
            );
            ActionExecutionDelegate next = () =>
            {
                return Task.FromResult<ActionExecutedContext>(null);
            };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.NotNull(actionExecutingContext.Result);
            var badRequestResult = Assert.IsType<Microsoft.AspNetCore.Mvc.BadRequestObjectResult>(actionExecutingContext.Result);
            Assert.Equal(400, badRequestResult.StatusCode);
        }
      }
}

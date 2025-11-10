using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Moq;

namespace Api.Tests {
    public class AuthorizeVehicleOwnerFilterTests {
        private readonly IFixture _fixture;
        public AuthorizeVehicleOwnerFilterTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Fact]
        public async Task OnActionExecutionAsync_VehicleBelongsToCustomer_ShouldCallNext() {


            var vehicleRepoMock = new Mock<IVehicleRepository>();
            var customerRepoMock = new Mock<ICustomerRepository>();

            vehicleRepoMock.Setup(v => v.GetCustomerIdByVehicleId(1)).ReturnsAsync(100);
            customerRepoMock.Setup(c => c.GetCustomerByAccountId(1))
                .ReturnsAsync(new DataAccess.Dtos.Customers.CustomerViewDto { Id = 100 });
            _fixture.Inject(vehicleRepoMock.Object);    
            _fixture.Inject(customerRepoMock.Object);
           
       
            var filter = _fixture.Create<API.Filters.AuthorizeVehicleOwnerFilter>();
            var httpContext = new DefaultHttpContext();
            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, "1") };
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"));

            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(httpContext, new Microsoft.AspNetCore.Routing.RouteData(), new ActionDescriptor());
            var actionArguments = new Dictionary<string, object> { { "vehicleId", 1 } };

            var actionExecutingContext = new ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                actionArguments,
                controller: null
            );

            bool nextCalled = false;
            ActionExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult<ActionExecutedContext>(null);
            };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.True(nextCalled);
            Assert.Equal(200, httpContext.Response.StatusCode); 
            Assert.Equal(100, (int)httpContext.Items["CustomerId"]);
        }
        [Fact]
        public async Task OnActionExecutionAsync_VehicleIsNotBelongCustomer_ReturnsForbiden() {


            var vehicleRepoMock = new Mock<IVehicleRepository>();
            var customerRepoMock = new Mock<ICustomerRepository>();

            vehicleRepoMock.Setup(v => v.GetCustomerIdByVehicleId(1)).ReturnsAsync(100);
            customerRepoMock.Setup(c => c.GetCustomerByAccountId(1))
                .ReturnsAsync(new DataAccess.Dtos.Customers.CustomerViewDto { Id = 30 });
            _fixture.Inject(vehicleRepoMock.Object);
            _fixture.Inject(customerRepoMock.Object);


            var filter = _fixture.Create<API.Filters.AuthorizeVehicleOwnerFilter>();
            var httpContext = new DefaultHttpContext();
            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, "1") };
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"));

            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(httpContext, new Microsoft.AspNetCore.Routing.RouteData(), new ActionDescriptor());
            var actionArguments = new Dictionary<string, object> { { "vehicleId", 1 } };

            var actionExecutingContext = new ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                actionArguments,
                controller: null
            );

            bool nextCalled = false;
            ActionExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult<ActionExecutedContext>(null);
            };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.False(nextCalled);
            Assert.Equal(403, httpContext.Response.StatusCode);
        }

        [Fact]
        public async Task OnActionExecutionAsync_VehicleIsMissing_ReturnsBadRequest() {


            var vehicleRepoMock = new Mock<IVehicleRepository>();
            var customerRepoMock = new Mock<ICustomerRepository>();

            vehicleRepoMock.Setup(v => v.GetCustomerIdByVehicleId(1)).ReturnsAsync(100);
            customerRepoMock.Setup(c => c.GetCustomerByAccountId(1))
                .ReturnsAsync(new DataAccess.Dtos.Customers.CustomerViewDto { Id = 30 });
            _fixture.Inject(vehicleRepoMock.Object);
            _fixture.Inject(customerRepoMock.Object);


            var filter = _fixture.Create<API.Filters.AuthorizeVehicleOwnerFilter>();
            var httpContext = new DefaultHttpContext();
            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, "1") };
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"));

            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(httpContext, new Microsoft.AspNetCore.Routing.RouteData(), new ActionDescriptor());
            var actionArguments = new Dictionary<string, object> {  };

            var actionExecutingContext = new ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                actionArguments,
                controller: null
            );

            bool nextCalled = false;
            ActionExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult<ActionExecutedContext>(null);
            };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.False(nextCalled);
            
        }

    }
}

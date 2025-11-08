using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using Microsoft.AspNetCore.Mvc.Filters;
using Moq;

namespace Api.Tests {
    public class AuthorizeCustomerOrStaffFilterTests {
        private readonly IFixture _fixture;
        public AuthorizeCustomerOrStaffFilterTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers=false});
        }
        [Fact]
        public async Task OnActionExecutionAsync_UserIsStaff_ShouldCallNext() {
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new System.Security.Claims.ClaimsIdentity(new[]
           {        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier,"1"),
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "Staff")
            }));
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var filter = _fixture.Create<API.Filters.AuthorizeCustomerOrStaffFilter>();
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "customerId", 1 }
                },
                controller: null
            );
            bool nextCalled = false;
           ActionExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult<Microsoft.AspNetCore.Mvc.Filters.ActionExecutedContext>(null);
            };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.True(nextCalled);
        }

        [Fact]
        public async Task OnActionExecutionAsync_UserIsCustomerIsNull_ShouldCallNext() {
            var customerRepositoryMock = new Mock<DataAccess.Interfaces.ICustomerRepository>();
            customerRepositoryMock.Setup(c => c.GetCustomerByAccountId(1))
                .ReturnsAsync(()=>null);
            _fixture.Inject(customerRepositoryMock.Object);
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new System.Security.Claims.ClaimsIdentity(new[]
           {        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier,"1"),
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "Customer")
            }));
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var filter = _fixture.Create<API.Filters.AuthorizeCustomerOrStaffFilter>();
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "customerId", 1 }
                },
                controller: null
            );
            bool nextCalled = false;
           ActionExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult<Microsoft.AspNetCore.Mvc.Filters.ActionExecutedContext>(null);
            };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.False(nextCalled);
            Assert.Equal(403, httpContext.Response.StatusCode);
        }

        [Fact]
        public async Task OnActionExecutionAsync_UserIsCustomerIdMismatch_ShouldCallNext() {
            var customerRepositoryMock = new Mock<DataAccess.Interfaces.ICustomerRepository>();
            customerRepositoryMock.Setup(c => c.GetCustomerByAccountId(1))
                .ReturnsAsync(new DataAccess.Dtos.Customers.CustomerViewDto { Id = 2 });
            _fixture.Inject(customerRepositoryMock.Object);
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new System.Security.Claims.ClaimsIdentity(new[]
           {        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier,"1"),
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "Customer")
            }));
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var filter = _fixture.Create<API.Filters.AuthorizeCustomerOrStaffFilter>();
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "customerId", 1 }
                },
                controller: null
            );
            bool nextCalled = false;
            ActionExecutionDelegate next = () =>
             {
                 nextCalled = true;
                 return Task.FromResult<Microsoft.AspNetCore.Mvc.Filters.ActionExecutedContext>(null);
             };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.False(nextCalled);
            Assert.Equal(403, httpContext.Response.StatusCode);
        }

        [Fact]
        public async Task OnActionExecutionAsync_UserIsCustomerIdMatch_ShouldCallNext() {
            var customerRepositoryMock = new Mock<DataAccess.Interfaces.ICustomerRepository>();
            customerRepositoryMock.Setup(c => c.GetCustomerByAccountId(1))
                .ReturnsAsync(new DataAccess.Dtos.Customers.CustomerViewDto { Id = 1 });
            _fixture.Inject(customerRepositoryMock.Object);
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new System.Security.Claims.ClaimsIdentity(new[]
           {        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier,"1"),
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "Customer")
            }));
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var filter = _fixture.Create<API.Filters.AuthorizeCustomerOrStaffFilter>();
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "customerId", 1 }
                },
                controller: null
            );
            bool nextCalled = false;
            ActionExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult<Microsoft.AspNetCore.Mvc.Filters.ActionExecutedContext>(null);
            };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.True(nextCalled);
            
        }
    }
}

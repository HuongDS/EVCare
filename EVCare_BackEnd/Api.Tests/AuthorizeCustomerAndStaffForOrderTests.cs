using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using Moq;

namespace Api.Tests {
    public class AuthorizeCustomerAndStaffForOrderTests {
        private readonly IFixture _fixture;
        public AuthorizeCustomerAndStaffForOrderTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Fact]
        public async Task OnActionExecutionAsync_UserIsStaff_ShouldCallNext() {
            
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new ClaimsIdentity(new[]
           {
                    new Claim(ClaimTypes.Role, "Staff")
            }));
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
     
            var filter = _fixture.Create<API.Filters.AuthorizeCustomerAndStaffForOrder>();
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "orderId", 1 }
                },
                controller: null
            );
            bool nextCalled = false;
            Microsoft.AspNetCore.Mvc.Filters.ActionExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult<Microsoft.AspNetCore.Mvc.Filters.ActionExecutedContext>(null);
            };
          
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
           
            Assert.True(nextCalled);
        }

        [Fact]
        public async Task OnActionExecutionAsync_UserIsCustomerAndNotOwner_ShouldSetForbiddenResult() {
            var appointmentRepositoryMock = new Mock<DataAccess.Interfaces.IAppointmentRepository>();
            appointmentRepositoryMock.Setup(a => a.GetByOrderIdAsync(1))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = 1,
                    CustomerId = 2
                });
            var filter = new API.Filters.AuthorizeCustomerAndStaffForOrder(appointmentRepositoryMock.Object);
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new ClaimsIdentity(new[]
           {
                    new Claim(ClaimTypes.Role, "Customer")
            }));
            httpContext.Items["CustomerId"] = 3; 
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "orderId", 1 }
                },
                controller: null
            );
            bool nextCalled = false;
            Microsoft.AspNetCore.Mvc.Filters.ActionExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult<Microsoft.AspNetCore.Mvc.Filters.ActionExecutedContext>(null);
            };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.False(nextCalled);
            var jsonResult = Assert.IsType<Microsoft.AspNetCore.Mvc.JsonResult>(actionExecutingContext.Result);
            Assert.NotNull(jsonResult);
        }

        [Fact]
        public async Task OnActionExecutionAsync_UserIsCustomerAndOwner_ShouldSetForbiddenResult() {
            var appointmentRepositoryMock = new Mock<DataAccess.Interfaces.IAppointmentRepository>();
            appointmentRepositoryMock.Setup(a => a.GetByOrderIdAsync(1))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = 1,
                    CustomerId = 2
                });
            var filter = new API.Filters.AuthorizeCustomerAndStaffForOrder(appointmentRepositoryMock.Object);
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new ClaimsIdentity(new[]
           {
                    new Claim(ClaimTypes.Role, "Customer")
            }));
            httpContext.Items["CustomerId"] = 2;
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "orderId", 1 }
                },
                controller: null
            );
            bool nextCalled = false;
            Microsoft.AspNetCore.Mvc.Filters.ActionExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult<Microsoft.AspNetCore.Mvc.Filters.ActionExecutedContext>(null);
            };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.True(nextCalled);
       
        }

        [Fact]
        public async Task OnActionExecutionAsync_OrderNotFound_ShouldSetNotFoundResult() {
            var appointmentRepositoryMock = new Mock<DataAccess.Interfaces.IAppointmentRepository>();
            appointmentRepositoryMock.Setup(a => a.GetByOrderIdAsync(1))
                .ReturnsAsync((DataAccess.Entities.Appointment?)null);
            _fixture.Inject(appointmentRepositoryMock.Object);  
            var filter = _fixture.Create<API.Filters.AuthorizeCustomerAndStaffForOrder>();
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new ClaimsIdentity(new[]
           {
                    new Claim(ClaimTypes.Role, "Customer")
            }));
            httpContext.Items["CustomerId"] = 2;
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "orderId", 1 }
                },
                controller: null
            );
            bool nextCalled = false;
            Microsoft.AspNetCore.Mvc.Filters.ActionExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult<Microsoft.AspNetCore.Mvc.Filters.ActionExecutedContext>(null);
            };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.False(nextCalled);
            var jsonResult = Assert.IsType<Microsoft.AspNetCore.Mvc.JsonResult>(actionExecutingContext.Result);
            Assert.NotNull(jsonResult);
        }
    }     
}

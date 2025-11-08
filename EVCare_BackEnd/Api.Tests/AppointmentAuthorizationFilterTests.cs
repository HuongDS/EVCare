using System.Security.Claims;
using API.Filters;
using AutoFixture;
using AutoFixture.AutoMoq;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Moq;

namespace Api.Tests {
    public class AppointmentAuthorizationFilterTests {
        private readonly IFixture _fixture;
        public AppointmentAuthorizationFilterTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Fact]
        public async Task OnActionExecutionAsync_UserIsStaff_ShouldCallNext() {

            var filter = _fixture.Create<AppointmentAuthorizationFilter>();

         
            var httpContext = new DefaultHttpContext();
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                    new Claim(ClaimTypes.Role, "Staff")
            }));

            var actionContext = new ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );

            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                new Dictionary<string, object>(), 
                controller: null
            );

            bool nextCalled = false;
            ActionExecutionDelegate next = () => {
                nextCalled = true;
                return Task.FromResult<ActionExecutedContext>(null);
            };

         
            await filter.OnActionExecutionAsync(actionExecutingContext, next);

        
            Assert.True(nextCalled);
            Assert.Null(actionExecutingContext.Result);
        }
        [Fact]
        public async Task OnActionExecutionAsync_UserIsCustomerAndNotOwner_ShouldSetForbiddenResult() {
            var appointmentRepositoryMock = new Mock<IAppointmentRepository>();
            var filter = new AppointmentAuthorizationFilter(appointmentRepositoryMock.Object);
            var httpContext = new DefaultHttpContext();
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                    new Claim(ClaimTypes.Role, "Customer")
            }));
            httpContext.Items["CustomerId"] = 1;
            var actionContext = new ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                new Dictionary<string, object> { { "appointmentId", 123 } }, 
                controller: null
            );
            appointmentRepositoryMock.Setup(repo => repo.GetByIdAsync(123))
                .ReturnsAsync(new DataAccess.Entities.Appointment { CustomerId = 2 });
            bool nextCalled = false;
            ActionExecutionDelegate next = () => {
                nextCalled = true;
                return Task.FromResult<ActionExecutedContext>(null);
            };
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
            Assert.False(nextCalled);
            var result = actionExecutingContext.Result as ObjectResult;
            Assert.NotNull(result);
         
        }
        [Fact]
        public async Task OnActionExecutionAsync_CustomerOwnsAppointment_ShouldCallNext() {
            // Arrange
            var repoMock = new Mock<IAppointmentRepository>();
            repoMock.Setup(r => r.GetByIdAsync(10))
                    .ReturnsAsync(new Appointment { Id = 10, CustomerId = 5 });

            var filter = new AppointmentAuthorizationFilter(repoMock.Object);

            var httpContext = new DefaultHttpContext();
            httpContext.Items["CustomerId"] = 5; 

            var actionContext = new ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new ActionDescriptor()
            );

            var actionExecutingContext = new ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                new Dictionary<string, object> { { "appointmentId", 10 } },
                controller: null
            );

            bool nextCalled = false;
            ActionExecutionDelegate next = () => {
                nextCalled = true;
                return Task.FromResult<ActionExecutedContext>(null);
            };

          
            await filter.OnActionExecutionAsync(actionExecutingContext, next);

           
            Assert.True(nextCalled);
            Assert.Null(actionExecutingContext.Result);
        }
        [Fact]
        public async Task OnActionExecutionAsync_RepositoryThrowsException_ShouldSetBadRequestResult() {
            var repoMock = new Mock<IAppointmentRepository>();
            repoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                    .ThrowsAsync(new Exception("Database error"));
            var filter = new AppointmentAuthorizationFilter(repoMock.Object);
            var httpContext = new DefaultHttpContext();
            httpContext.Items["CustomerId"] = 1; 
            var actionContext = new ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new ActionDescriptor()
            );
            var actionExecutingContext = new ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                new Dictionary<string, object> { { "appointmentId", 999 } },
                controller: null
            );
            bool nextCalled = false;
            ActionExecutionDelegate next = () => {
                nextCalled = true;
                return Task.FromResult<ActionExecutedContext>(null);
            };
          
            await filter.OnActionExecutionAsync(actionExecutingContext, next);
           
            Assert.False(nextCalled);
            var result = actionExecutingContext.Result as ObjectResult;
            Assert.NotNull(result);
           
        }

    }
}
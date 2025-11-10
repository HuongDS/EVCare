using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using Moq;

namespace Api.Tests {
    public class AuthorizeTechnicianDetailTests {
        private readonly IFixture _fixture;
        public AuthorizeTechnicianDetailTests() { 
            
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false});

        }
        [Fact]
        public async Task OnActionExecutionAsync_UserIsStaffAndAdmin_ShouldCallNext() {
            var filter = _fixture.Create<API.Filters.AuthorizeTechnicianDetail>();
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            var claims = new List<System.Security.Claims.Claim> {
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "Staff"),
                
            };
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new System.Security.Claims.ClaimsIdentity(claims, "mock"));
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(httpContext, new Microsoft.AspNetCore.Routing.RouteData(), new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor());
            var actionArguments = new Dictionary<string, object> { { "technicianId", 1 } };
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                actionArguments,
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
        public async Task OnActionExecutionAsync_UserIsTechAndTechIsAuthorization_ShouldCallNext() {
            var technicianRepoMock = new Moq.Mock<DataAccess.Interfaces.ITechnicianRepository>();
            technicianRepoMock.Setup(t => t.GetTechnicianIdByAccountId(Moq.It.IsAny<int>())).ReturnsAsync(1);
            _fixture.Inject(technicianRepoMock.Object);
            var filter = _fixture.Create<API.Filters.AuthorizeTechnicianDetail>();
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            var claims = new List<System.Security.Claims.Claim> {
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "Technician"),
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, "1")

            };
            httpContext.User = new System.Security.Claims.ClaimsPrincipal(new System.Security.Claims.ClaimsIdentity(claims, "mock"));
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(httpContext, new Microsoft.AspNetCore.Routing.RouteData(), new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor());
            var actionArguments = new Dictionary<string, object> { { "technicianId", 1 } };
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                actionArguments,
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

    }
}

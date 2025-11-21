using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Moq;

namespace Api.Tests {
    public class AuthorizeEmployeeIsAbsentTests {
        private readonly IFixture _fixture;
        public AuthorizeEmployeeIsAbsentTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }

        [Fact]
        public async Task OnActionExecutionAsync_EmployeeIsAvaliable_ShouldCallNext() {
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            
            httpContext.Items["EmployeeId"] = 1;
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var employeeRepositoryMock = new Moq.Mock<DataAccess.Interfaces.IEmployeeRepository>();
            employeeRepositoryMock.Setup(e => e.GetByIdAsync(1))
                .ReturnsAsync(new DataAccess.Entities.Employee
                {
                    Id = 1,
                    Status = DataAccess.Enums.EmployeeStatusEnum.Available
                });
            _fixture.Inject(employeeRepositoryMock.Object);
            var filter = _fixture.Create<API.Filters.AuthorizeEmployeeIsAbsent>();
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "employeeId", 1 }
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
        public async Task OnActionExecutionAsync_EmployeeIsOnLeave_ReturnsJsonResult() {
            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            httpContext.Items["EmployeeId"] = 1;
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );
            var employeeRepositoryMock = new Moq.Mock<DataAccess.Interfaces.IEmployeeRepository>();
            employeeRepositoryMock.Setup(e => e.GetByIdAsync(1))
                .ReturnsAsync(new DataAccess.Entities.Employee
                {
                    Id = 1,
                    Status = DataAccess.Enums.EmployeeStatusEnum.OnLeave
                });
            _fixture.Inject(employeeRepositoryMock.Object);
            var filter = _fixture.Create<API.Filters.AuthorizeEmployeeIsAbsent>();
            var actionExecutingContext = new Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext(
                actionContext,
                new List<Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata>(),
                new Dictionary<string, object>
                {
                    { "employeeId", 1 }
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
            var jsonResult = actionExecutingContext.Result as JsonResult;
            Assert.NotNull(jsonResult);
            Assert.Equal(403, jsonResult.StatusCode);
            Assert.False(nextCalled);

          
        }

    }
}

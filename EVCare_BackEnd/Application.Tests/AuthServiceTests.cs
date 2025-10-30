using Application.Interfaces;
using Application.Services;
using Microsoft.Extensions.Configuration;
using DataAccess.Dtos.Register;
using DataAccess.Interfaces;
using Moq;
using System.Threading.Tasks;

namespace Application.Tests {
    public class AuthServiceTests {
        [Fact]
        //methodname_condition_expectedResult
        public async Task ValidateInfo_WithValidData_ReturnsSuccessResult() {
            //Arrange
            var inputRegister = new RegisterRequestDto
            {
                email = "abc@gmail.com",
                firstName = "Sanh",
                lastName = "Nguyen",
                password = "12345678@s",
                phone = "0908249649"
            };
            var accountRepositoryMock = new Mock<IAccountRepository>();
            var tokenServiceMock = new Mock<ITokenServices>();
            var configurationMock = new Mock<IConfiguration>();
            var refreshtokenRepositoryMock = new Mock<IRefreshTokenRepository>();
            var customerRepositoryMock = new Mock<ICustomerRepository>();
            var optServiceMock = new Mock<IOtpServices>();
            var employeeRepositoryMock = new Mock<IEmployeeRepository>();
            var technicianRepositoryMock = new Mock<ITechnicianRepository>();


            accountRepositoryMock.Setup(repo => repo.GetAccountByEmail(It.IsAny<string>()))
                .ReturnsAsync(()=>null);
            accountRepositoryMock.
                Setup(repo => repo.GetAccountByPhoneAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);
           
            var authService = new AuthServices(
                accountRepositoryMock.Object
                ,tokenServiceMock.Object
                ,configurationMock.Object
                ,refreshtokenRepositoryMock.Object,
                customerRepositoryMock.Object,
                optServiceMock.Object,
                employeeRepositoryMock.Object,
                technicianRepositoryMock.Object);

            //Act
            var result = await authService.ValidateInfo(inputRegister);
            //Assert
            Assert.NotNull(result);
            Assert.Equal(result,inputRegister);

        }
    }
}
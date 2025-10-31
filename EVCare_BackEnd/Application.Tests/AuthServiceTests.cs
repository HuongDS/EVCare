using System.Threading.Tasks;
using Application.Infrastructures;
using Application.Interfaces;
using Application.Services;
using AutoFixture;
using AutoFixture.AutoMoq;
using DataAccess.Dtos.Accounts;
using DataAccess.Dtos.Register;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Moq;

namespace Application.Tests {
    public class AuthServiceTests {

        private readonly IFixture _fixture;
        public AuthServiceTests() {

            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });

        }

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
            var accountRepositoryMock = _fixture.Freeze<Mock<IAccountRepository>>();
            accountRepositoryMock.Setup(r => r.GetAccountByEmail(It.IsAny<string>()))
                .ReturnsAsync(() => null);
            accountRepositoryMock.Setup(r => r.GetAccountByPhoneAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);
            var authService = _fixture.Create<AuthServices>();


            //Act
            var result = await authService.ValidateInfo(inputRegister);
            //Assert
            Assert.NotNull(result);
            Assert.Equal(result, inputRegister);

        }
        [Fact]
        public async Task ValidateInfo_WithExistingEmailAndEmailIsActive_ReturnsThrowException() {
            //Arrange
            var inputRegister = new RegisterRequestDto
            {
                email = "abc@gmail.com",
                firstName = "Sanh",
                lastName = "Nguyen",
                password = "12345678@s",
                phone = "0908249649"
            };
            var accountRepositoryMock = _fixture.Freeze<Mock<IAccountRepository>>();
            accountRepositoryMock.Setup(a => a.GetAccountByEmail(It.IsAny<string>()))
                .ReturnsAsync(new DataAccess.Entities.Account
                {
                    Email = inputRegister.email,
                    Customer = null,
                    Employee = null,
                    RefreshTokens = null,
                    Deleted_At = DateTime.MinValue

                });
            var authService = _fixture.Create<AuthServices>();


            var exception = await Assert.ThrowsAsync<Exception>(
                async () => await authService.ValidateInfo(inputRegister));
            Assert.Equal(Message.EMAIL_EXISTS, exception.Message);

        }

        [Fact]
        public async Task ValidateInfo_WithExistingEmailAndEmailIsBanned_ReturnsThrowException() {
            //Arrange
            var inputRegister = new RegisterRequestDto
            {
                email = "abc@gmail.com"
            };
            var accountRepositoryMock = _fixture.Freeze<Mock<IAccountRepository>>();
            accountRepositoryMock.Setup(a => a.GetAccountByPhoneAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);
            accountRepositoryMock.Setup(a => a.GetAccountByEmail(It.IsAny<string>()))
                .ReturnsAsync(new DataAccess.Entities.Account
                {
                    Email = "abc@gmail.com",
                    Customer = null,
                    Employee = null,
                    RefreshTokens = null,
                    Deleted_At = DateTime.Now,
                    Create_At = DateTime.Now.AddDays(-10),
                    First_Name = "Test",
                    Last_Name = "User",
                    Hash_Password = "abcs",
                    Id = 14,
                    Phone = "0908249649",
                    Role = DataAccess.Enums.RoleEnum.Admin,
                    Updated_At = DateTime.Now.AddDays(-5)
                });
            var authService = _fixture.Create<AuthServices>();


            var exception = await Assert.ThrowsAsync<Exception>(
                async () => await authService.ValidateInfo(inputRegister));
            Assert.Equal(Message.ACCOUNT_HAS_BEEN_DISABLED, exception.Message);

        }

        [Fact]
        public async Task ValidateInfo_WithExistingPhone_ReturnsThrowException() {
            //Arrange
            var inputRegister = new RegisterRequestDto
            {
                phone = "0908249649"
            };
            var accountRepositoryMock = _fixture.Freeze<Mock<IAccountRepository>>();
            accountRepositoryMock.Setup(a => a.GetAccountByEmail(It.IsAny<string>()))
                .ReturnsAsync(() => null);
            accountRepositoryMock.Setup(r => r.GetAccountByPhoneAsync(It.IsAny<string>()))
                .ReturnsAsync(new DataAccess.Entities.Account
                {
                    Phone = "0908249649",
                    Customer = null,
                    Employee = null,
                    RefreshTokens = null,
                    Deleted_At = DateTime.MinValue
                });
            var authService = _fixture.Create<AuthServices>();
            var exception = await Assert.ThrowsAsync<Exception>(
                async () => await authService.ValidateInfo(inputRegister));
            Assert.Equal(Message.PHONE_EXISTS, exception.Message);
        }
        [Fact]
        public async Task ValidateInfo_WithWrongEmailFormat_ReturnsThrowException() {
            //Arrange
            var inputRegister = new RegisterRequestDto
            {
                phone = "0908249649",
                email = "abcgmail1.com"
            };
            var accountRepositoryMock = _fixture.Freeze<Mock<IAccountRepository>>();
            accountRepositoryMock.Setup(a => a.GetAccountByEmail(It.IsAny<string>()))
                .ReturnsAsync(() => null);
            accountRepositoryMock.Setup(r => r.GetAccountByPhoneAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);
            var authService = _fixture.Create<AuthServices>();
            var exception = await Assert.ThrowsAsync<Exception>(
                async () => await authService.ValidateInfo(inputRegister));
            Assert.Equal(Message.INVALID_EMAIL, exception.Message);
        }
        [Fact]
        public async Task ValidateInfo_WithWeakPassword_ReturnsThrowException() {
            //Arrange
            var inputRegister = new RegisterRequestDto
            {
                phone = "0908249649",
                email = "abc@gmail.com",
                password = "1234"

            };
            var accountRepositoryMock = _fixture.Freeze<Mock<IAccountRepository>>();
            accountRepositoryMock.Setup(a => a.GetAccountByEmail(It.IsAny<string>()))
                .ReturnsAsync(() => null);
            accountRepositoryMock.Setup(r => r.GetAccountByPhoneAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);
            var authService = _fixture.Create<AuthServices>();
            var exception = await Assert.ThrowsAsync<Exception>(
                async () => await authService.ValidateInfo(inputRegister));
            Assert.Equal(Message.WEAK_PASSWORD, exception.Message);
        }
        [Fact]
        public async Task ValidateInfo_WithInvalidPhoneNumber_ReturnsThrowException() {
            //Arrange
            var inputRegister = new RegisterRequestDto
            {
                phone = "09082A49649",
                email = "abc@gmail.com",
                password = "12345678@s"
            };
            var accountRepositoryMock = _fixture.Freeze<Mock<IAccountRepository>>();
            accountRepositoryMock.Setup(a => a.GetAccountByEmail(It.IsAny<string>()))
                .ReturnsAsync(() => null);
            accountRepositoryMock.Setup(r => r.GetAccountByPhoneAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);
            var authService = _fixture.Create<AuthServices>();
            var exception = await Assert.ThrowsAsync<Exception>(
                async () => await authService.ValidateInfo(inputRegister));
            Assert.Equal(Message.INVALID_PHONE, exception.Message);
        }

        [Fact]
        public async Task RegisterAccountAsync_WithValidData_ReturnsAccount() {
            //Arrange
            var inputRegister = new RegisterRequestDto
            {

                email = "abc@gmail.com",
                firstName = "Sanh",
                lastName = "Nguyen",
                password = "12345678@s",
                phone = "0908249649"
            };

            var accountRepositoryMock = _fixture.Freeze<Mock<IAccountRepository>>();
            accountRepositoryMock.Setup(a => a.AddAsync(It.IsAny<DataAccess.Entities.Account>()))
                .ReturnsAsync((DataAccess.Entities.Account acc) => acc);
            accountRepositoryMock.Setup(a => a.GetAccountByEmail(It.IsAny<string>()))
                .ReturnsAsync(new DataAccess.Entities.Account
                {
                    Create_At = DateTime.Now,
                    Id = 1000

                });
            var authServiceMock = new Mock<AuthServices>(
                    accountRepositoryMock.Object,
                    _fixture.Create<ITokenServices>(),
                    _fixture.Create<IConfiguration>(),
                    _fixture.Create<IRefreshTokenRepository>(),
                    _fixture.Create<ICustomerRepository>(),
                    _fixture.Create<IOtpServices>(),
                    _fixture.Create<IEmployeeRepository>(),
                    _fixture.Create<ITechnicianRepository>()
                );

            authServiceMock.Setup(a => a.ValidateInfo(It.IsAny<RegisterRequestDto>()))
                .ReturnsAsync(inputRegister);
            var authService = authServiceMock.Object;
            //Act
            var result = await authService.RegisterAccountAsync(inputRegister);
            //Assert
            Assert.NotNull(result);
            Assert.True(result.accountId > 0);
        }

        [Fact]
        public async Task RegisterAccountAsync_WithInvalidData_ThrowsException() {


            var authServiceMock = new Mock<AuthServices>(
                   _fixture.Create<IAccountRepository>(),
                   _fixture.Create<ITokenServices>(),
                   _fixture.Create<IConfiguration>(),
                   _fixture.Create<IRefreshTokenRepository>(),
                   _fixture.Create<ICustomerRepository>(),
                   _fixture.Create<IOtpServices>(),
                   _fixture.Create<IEmployeeRepository>(),
                   _fixture.Create<ITechnicianRepository>()
               );

            authServiceMock.Setup(a => a.ValidateInfo(It.IsAny<RegisterRequestDto>()))
                .ThrowsAsync(new Exception("Data invalid"));
            var authService = authServiceMock.Object;
            var resultException = await Assert.ThrowsAsync<Exception>(
                async () => await authService.RegisterAccountAsync(new RegisterRequestDto()));
            Assert.Equal("Data invalid", resultException.Message);

        }

        [Fact]
        public async void SetRefreshCookie_WithValidData_SetsCookie() {

           
            var cookieName = "RefreshTokenCookie";
            var refreshValue = "refresh_abc123";
            var expires = DateTime.UtcNow.AddDays(7);

            var configMock = _fixture.Freeze<Mock<IConfiguration>>();
            configMock.SetupGet(c => c["Cookies:RefreshTokenName"]).Returns(cookieName);

            var httpContext = new DefaultHttpContext();
            httpContext.Response.Body = new MemoryStream(); 

            var authService = _fixture.Create<AuthServices>();

           
            authService.SetRefreshCookie(httpContext, refreshValue, expires);

           
            var setCookieHeader = httpContext.Response.Headers["Set-Cookie"].ToString();

            Assert.Contains($"{cookieName}={refreshValue}", setCookieHeader);
            Assert.Contains("httponly", setCookieHeader.ToLower());
            Assert.Contains("secure", setCookieHeader.ToLower());
            Assert.Contains("samesite=none", setCookieHeader.ToLower());
            var expectedExpires = expires.ToUniversalTime().ToString("R").ToLower();
            Assert.Contains($"expires={expectedExpires}", setCookieHeader.ToLower());

        }
    }
  }
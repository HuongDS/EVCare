using Application.Interfaces;
using Application.Services;
using Microsoft.Extensions.Configuration;
using DataAccess.Dtos.Register;
using DataAccess.Interfaces;
using Moq;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using Application.Infrastructures;

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
    
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Services;
using DataAccess.Entities;
using DocumentFormat.OpenXml.Spreadsheet;
using Moq;
using StackExchange.Redis;

namespace Application.Tests {
    public class OTPServiceTests {
        [Fact]
        public async Task VerifyOtpAsync_WithValidEmailAndOtp_ReturnsTrueAndDeleteOTP() {
            // Arrange
            var email = "test@gmail.com";
            var otp = "123456";
           
            var dbMock = new Mock<IDatabase>();
            dbMock.Setup(db => db.StringGetAsync(It.IsAny<RedisKey>(), It.IsAny<CommandFlags>()))
             .ReturnsAsync("123456");

            dbMock.Setup(db => db.KeyDeleteAsync(It.IsAny<RedisKey>(), It.IsAny<CommandFlags>()))
                  .ReturnsAsync(true);
            var connectionMock = new Mock<IConnectionMultiplexer>();
            connectionMock.Setup(c => c.GetDatabase(It.IsAny<int>(), It.IsAny<object>()))
                          .Returns(dbMock.Object);
            var otpService = new OtpServices(connectionMock.Object);
            var result = await otpService.VerifyOtpAsync(email, otp);

            // Assert
            Assert.True(result);
            




        }
    }

}

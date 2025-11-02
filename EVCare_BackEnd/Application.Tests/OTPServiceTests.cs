using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Services;
using AutoFixture.Xunit2;
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
        [Theory,AutoData]
        public async Task VerifyOtpAsync_WithInvalidEmailAndOtp_ReturnsFasle(string email,string otp) {
            var dbMock = new Mock<IDatabase>();
            dbMock.Setup(db => db.StringGetAsync(It.IsAny<RedisKey>(), It.IsAny<CommandFlags>()))
             .ReturnsAsync((string?)null);
            var connectionMock = new Mock<IConnectionMultiplexer>();
            connectionMock.Setup(c => c.GetDatabase(It.IsAny<int>(), It.IsAny<object>()))
                          .Returns(dbMock.Object);
            var otpService = new OtpServices(connectionMock.Object);
            var result = await otpService.VerifyOtpAsync(email, otp);
            Assert.False(result);


        }


        [Theory,AutoData]
        public async Task SaveOtpAsync_WithValidData_SavesOtpToDatabase(string email, string otp, int expireMinutes) {
         
            var dbMock = new Mock<IDatabase>();
            dbMock.Setup(db => db.StringSetAsync(
                        It.IsAny<RedisKey>(),
                        It.IsAny<RedisValue>(),
                        It.IsAny<TimeSpan?>(),
                        It.IsAny<bool>(),         
                        It.IsAny<When>(),
                        It.IsAny<CommandFlags>()))
                    .ReturnsAsync(true);
            var connectionMock = new Mock<IConnectionMultiplexer>();
            connectionMock.Setup(c => c.GetDatabase(It.IsAny<int>(), It.IsAny<object>()))
                          .Returns(dbMock.Object);
            var otpService = new OtpServices(connectionMock.Object);
          
            await otpService.SaveOtpAsync(email, otp, expireMinutes);
       
            dbMock.Verify(db => db.StringSetAsync(
                 It.Is<RedisKey>(k => k.ToString() == $"otp:{email}"),
                 It.Is<RedisValue>(v => v.ToString() == otp),
                 It.IsAny<TimeSpan?>(),
                 It.Is<bool>(b => b == false),   
                 It.Is<When>(w => w == When.Always),
                 It.Is<CommandFlags>(f => f == CommandFlags.None)),
             Times.Once);
        }
    }

}

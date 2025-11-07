using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Entities;
using Microsoft.Extensions.Configuration;
using Moq;

namespace Application.Tests {
    public class TokenServiceTests {
        private readonly IFixture _fixture;
        public TokenServiceTests() {
            _fixture = new Fixture()
               .Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Fact]
        public void GenerateAccessToken_ShouldReturnToken() {
            var configMock = _fixture.Freeze<Mock<IConfiguration>>();
            configMock.Setup(c => c["Jwt:Key"]).Returns("ThisisASecretKeyForJwtTokenGeneration123");
            configMock.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");
            configMock.Setup(c => c["Jwt:Audience"]).Returns("TestAudience");
            configMock.Setup(c => c["Jwt:AccessTokenMinutes"]).Returns("30");
            var tokenService = _fixture.Create<Application.Services.TokenServices>();
            var account = new DataAccess.Entities.Account
            {
                Id = 1,
                Email = "abc",
                Role = DataAccess.Enums.RoleEnum.Customer
            };
            var token = tokenService.GenerateAccessToken(account);
            Assert.False(string.IsNullOrWhiteSpace(token));

            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            Assert.Equal("TestIssuer", jwt.Issuer);
            Assert.Contains("TestAudience", jwt.Audiences);
            Assert.Contains(jwt.Claims, c => c.Type == ClaimTypes.Email && c.Value == account.Email);
            Assert.Contains(jwt.Claims, c => c.Type == ClaimTypes.Role && c.Value == account.Role.ToString());

        }
        [Fact]
        public void GenerateRefreshToken_ShouldReturnBase64String_AndBe64Bytes() {
            var configMock = _fixture.Freeze<Mock<IConfiguration>>();
            configMock.Setup(c => c["Jwt:Key"]).Returns("ThisisASecretKeyForJwtTokenGeneration123");
            configMock.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");
            configMock.Setup(c => c["Jwt:Audience"]).Returns("TestAudience");
            configMock.Setup(c => c["Jwt:AccessTokenMinutes"]).Returns("30");
            var tokenService = _fixture.Create<Application.Services.TokenServices>();
           
            var token1 = tokenService.GenerateRefreshToken();
            var token2 = tokenService.GenerateRefreshToken();

            Assert.False(string.IsNullOrWhiteSpace(token1));
            Assert.False(string.IsNullOrWhiteSpace(token2));

            var bytes1 = Convert.FromBase64String(token1);
            var bytes2 = Convert.FromBase64String(token2);
            Assert.Equal(64, bytes1.Length); 
            Assert.Equal(64, bytes2.Length);
            Assert.NotEqual(token1, token2);
        }
        [Fact]
        public void HashToken_ShouldBeDeterministic_AndSHA256Base64() {
            var configMock = _fixture.Freeze<Mock<IConfiguration>>();
            configMock.Setup(c => c["Jwt:Key"]).Returns("ThisisASecretKeyForJwtTokenGeneration123");
            configMock.Setup(c => c["Jwt:Secret"]).Returns("ThisisASecretKeyForJwtTokenGeneration123");
            var tokenService = _fixture.Create<Application.Services.TokenServices>();
            var raw = "hello-world";
            var h1 = tokenService.HashToken(raw);
            var h2 = tokenService.HashToken(raw);
            Assert.False(string.IsNullOrWhiteSpace(h1));
            Assert.Equal(h1, h2);
            var hashBytes = Convert.FromBase64String(h1);
            Assert.Equal(32, hashBytes.Length);
        }
        [Fact]
        public void GetExpireDays_ShouldRespectConfigDays() {
            var configMock = _fixture.Freeze<Mock<IConfiguration>>();
            configMock.Setup(c => c["Jwt:RefreshTokenDays"]).Returns("7");
            configMock.Setup(c => c["Jwt:Key"]).Returns("ThisisASecretKeyForJwtTokenGeneration123");
            configMock.Setup(c => c["Jwt:Secret"]).Returns("ThisisASecretKeyForJwtTokenGeneration123");

            var tokenService = _fixture.Create<Application.Services.TokenServices>();

            var before = DateTime.UtcNow.AddDays(7);
            var dt = tokenService.GetExpireDays();

           
            Assert.Equal(before.Date, dt.Date);
        }
    }
  }

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
      }
    }

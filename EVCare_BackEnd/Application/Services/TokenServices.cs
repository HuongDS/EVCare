using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Application.Services
{
    public class TokenServices : ITokenServices
    {
        private readonly IConfiguration _configuration;
        public TokenServices(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string GenerateAccessToken(Account account)
        {
            var secretKey = _configuration["Jwt:Key"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); // sign's information

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
                new Claim(ClaimTypes.Email, account.Email),
                new Claim(ClaimTypes.Role, account.Role.ToString())
            };

            var minutes = int.Parse(_configuration["Jwt:AccessTokenMinutes"] ?? "20");
            var expires = DateTime.Now.AddMinutes(minutes);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public string GenerateRefreshToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(bytes);
        }
        //public ClaimsPrincipal? GetClaimsPrincipalFromExpiredToken(string token)
        //{
        //    var parameters = new TokenValidationParameters
        //    {
        //        ValidateAudience = false,
        //        ValidateIssuer = false,
        //        ValidateIssuerSigningKey = true,
        //        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
        //        ValidateLifetime = false // allow read expired tokens
        //    };

        //    var handler = new JwtSecurityTokenHandler();
        //    try
        //    {
        //        var principal = handler.ValidateToken(token, parameters, out _);
        //        return principal;
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}
        public string HashToken(string token)
        {
            using var h = SHA256.Create();
            var hash = h.ComputeHash(Encoding.UTF8.GetBytes(token));
            return Convert.ToBase64String(hash);
        }
        public DateTime GetExpireDays()
        {
            return DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:RefreshTokenDays"] ?? "7"));
        }
    }
}

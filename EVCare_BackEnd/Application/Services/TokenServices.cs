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
        private readonly string _secretKey;
        public TokenServices(IConfiguration configuration)
        {
            _configuration = configuration;
            _secretKey = configuration["ActionToken:Secret"]!;
        }
        public string GenerateAccessToken(Account account)
        {
            var secretKey = _configuration["Jwt:Key"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); 

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
                new Claim(ClaimTypes.Email, account.Email),
                new Claim(ClaimTypes.Role, account.Role.ToString())
            };

            var minutes = int.Parse(_configuration["Jwt:AccessTokenMinutes"] ?? "20");
            var expires = DateTime.UtcNow.AddMinutes(minutes);

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
        public string Issue(int customerId, int appointmentId, string action, TimeSpan ttl)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var jti = Guid.NewGuid().ToString();
            var now = DateTime.UtcNow;
            var claims = new[]
            {
                new Claim("cid", customerId.ToString()),
                new Claim("aid", appointmentId.ToString()),
                new Claim("act", action),
                new Claim(JwtRegisteredClaimNames.Jti, jti)
            };
            var token = new JwtSecurityToken(
                    issuer: null, audience: null, claims: claims, notBefore: now, expires: now.Add(ttl), signingCredentials: cred
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public (bool, int, int, string, string) Validate(string token)
        {
            var parameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey)),
                ClockSkew = TimeSpan.Zero
            };
            var handler = new JwtSecurityTokenHandler();
            try
            {
                var principal = handler.ValidateToken(token, parameters, out var _);
                var cid = int.Parse(principal.Claims.First(c => c.Type == "cid").Value);
                var aid = int.Parse(principal.Claims.First(c => c.Type == "aid").Value);
                var act = principal.Claims.First(c => c.Type == "act").Value;
                var jti = principal.Claims.First(c => c.Type == JwtRegisteredClaimNames.Jti).Value;
                return (true, cid, aid, act, jti);
            }
            catch (Exception e)
            {
                throw new Exception($"Invalid token. {e.Message}");
            }
        }
    }
}

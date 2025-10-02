using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Application.Services
{
    public class LinkServices : ILinkServices
    {
        private readonly IConfiguration _configuration;
        private readonly ITokenServices _tokenServices;

        public LinkServices(IConfiguration configuration, ITokenServices tokenServices)
        {
            _configuration = configuration;
            _tokenServices = tokenServices;
        }
        public (string, string) GenerateActionLinks(int appointmentId, int customerId)
        {
            var baseUrl = _configuration["App:PublicBaseUrl"]!.TrimEnd('/');
            var ttl = TimeSpan.FromHours(int.Parse(_configuration["ActionToken:TtlHours"]!));
            var confirmToken = _tokenServices.Issue(customerId, appointmentId, "confirm", ttl);
            var cancelToken = _tokenServices.Issue(customerId, appointmentId, "cancel", ttl);
            return (
                $"{baseUrl}/api/Appointment/customer-confirm-appointment?token={confirmToken}",
                $"{baseUrl}/api/Appointment/customer-cancel-appointment?token={cancelToken}"
                );
        }
    }
}

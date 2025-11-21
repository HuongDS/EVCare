using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IPayOSGateWay
    {
        Task<(bool ok, string? checkoutUrl, string raw)> CreateAsync(
            long orderCode, long amount, string description, string returnUrl, string cancelUrl);

        bool Verify(string rawBody, string? headerSignature);
    }
}

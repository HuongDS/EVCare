using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Google.Apis.Auth;

namespace Application.Services {
    public class GoogleValidator : IGoogleValidator {
        public async Task<GoogleJsonWebSignature.Payload> ValidateAsync(string token) {
            return await GoogleJsonWebSignature.ValidateAsync(token);
        }
    }
}

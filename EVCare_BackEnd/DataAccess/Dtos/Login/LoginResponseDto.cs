using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Login
{
    public class LoginResponseDto
    {
        public string accessToken { get; set; }
        public string refreshToken { get; set; }
    }
}

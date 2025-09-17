using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Login
{
    public class LoginRequestDto
    {
        public string email { get; set; }
        public string password { get; set; }
    }
}

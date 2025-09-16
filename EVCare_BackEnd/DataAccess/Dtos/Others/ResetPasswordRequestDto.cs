using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Others
{
    public class ResetPasswordRequestDto
    {
        public string email { get; set; }
        public string newPassword { get; set; }
        public string otp { get; set; }
    }
}

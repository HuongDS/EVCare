using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Accounts
{
    public class AccountUpdatePasswordDto
    {
        public string newPassword { get; set; }
        public string oldPassword { get; set; }
    }
}

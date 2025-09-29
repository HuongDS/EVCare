using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Accounts
{
    public class AccountViewModel
    {
        public int Id { get; set; }
        public RoleEnum Role { get; set; }
        public string? Email { get; set; }
        public string? First_Name { get; set; }
        public string? Last_Name { get; set; }
        public string? Phone { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Register
{
    public class RegisterResponseDto
    {
        public string email { get; set; }
        public string phone { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
    }
}

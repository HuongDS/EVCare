using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Accounts;
using DataAccess.Enums;

namespace DataAccess.Dtos.MongoDb_Message
{
    public class Participant
    {
        public string AccountId { get; set; }
        public RoleEnum Role { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
    }
}

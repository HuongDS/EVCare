using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Account : IEntity,IDelete,ICreate,IUpdate
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string HashPassword { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public bool isBanned { get; set; } = false; 
        public Role Role { get; set; } = Role.Customer;
        public DateTime Updated_At { get ; set ; }
        public DateTime Deleted_At { get ; set ; }
        public DateTime Create_At { get ; set ; }
    }
}

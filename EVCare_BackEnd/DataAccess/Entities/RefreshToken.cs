using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class RefreshToken : IEntity
    {
        public int Id { get ; set ; }
        public string Token { get ; set ; }
        public DateTime ExpiryDate { get ; set ; }
        public int AccountId { get ; set ; }
        public bool IsRevoked { get ; set ; }
    }
}

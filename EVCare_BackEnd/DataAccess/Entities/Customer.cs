using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Customer : IEntity
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public CustomerRankEnum Rank { get; set; }
        public string Address { get; set; }
    }

}

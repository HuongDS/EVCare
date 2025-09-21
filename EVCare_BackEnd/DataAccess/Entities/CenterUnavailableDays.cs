using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class CenterUnavailableDays : IEntity
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }   
        public string Reason { get; set; }   
        public UnavailableType Type { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Salary : IEntity,ICreate
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }  
        public decimal Bonus { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int DayWork { get; set; }
        public DateTime Create_At { get ; set ; }
    }
}

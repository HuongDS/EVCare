using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Employee : IEntity,IUpdate,IDelete
    {
        public int Id { get; set; }
        public string AccountId { get; set; }
        public Account Account { get; set; }
        public string CCCD { get; set; }
        public int rate { get; set; }
        public decimal BaseSalary { get; set; }
        public DateTime Updated_At { get ; set ; }
        public DateTime Deleted_At { get ; set ; }
        public ICollection<Application> Applications { get; set; }
        public ICollection<Salary> Salaries { get; set; }
        public Technician? Technician { get; set; }

    }
}

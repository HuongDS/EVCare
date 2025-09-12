using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Technician : IEntity
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public int TechnicianCategoryId { get; set; }
        public TechnicianCategory TechnicianCategory { get; set; }

        public DateTime Created_At { get; set; }

    }
}

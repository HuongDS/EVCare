using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class ReviewEmployee : ICreate
    {
        public int ReviewId { get; set; }
        public Review Review { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public int Rates { get; set; }
        public DateTime Create_At { get; set; }

    }
}

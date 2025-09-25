using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Applications
{
    public class ApplicationCreateDto
    {
        public int employeeID { get; set; }
        //public DateTime dateOffFrom { get; set; }
        //public DateTime dateOffTo { get; set; }
        public DateTime dateOff { get; set; }
        public string reason { get; set; }
    }
}

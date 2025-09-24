using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Applications
{
    public class ApplicationEmployeeCreateDto
    {
        public DateTime dateOff { get; set; }
        public string reason { get; set; }
    }
}

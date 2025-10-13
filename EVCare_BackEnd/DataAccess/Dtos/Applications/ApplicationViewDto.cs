using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Applications
{
    public class ApplicationViewDto
    {
        public DateTime dateOff { get; set; }
        public string reason { get; set; }
        public  ApplicationStatusEnum Status { get; set; }  
        
        public string note { get; set; }
        public DateTime createdAt { get; set; }
    }
}

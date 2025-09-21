using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Applications
{
    public class ApplicationViewDto
    {
        public DateTime dateOff { get; set; }
        public string reason { get; set; }
        public bool isApproved { get; set; }
        public string note { get; set; }
        public DateTime createdAt { get; set; }
    }
}

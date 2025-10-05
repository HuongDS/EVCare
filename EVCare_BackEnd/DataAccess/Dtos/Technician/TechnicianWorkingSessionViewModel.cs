using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Technician
{
    public class TechnicianWorkingSessionViewModel
    {
        public  int  OrderId { get; set; }
        public int TechnicianId { get; set; }
        public TechnicianWorkingSessionEnum Status {  get; set; }
    }
}

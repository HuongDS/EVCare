using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;
using DataAccess.Enums;

namespace DataAccess.Dtos.Technician
{
    public class TechnicianViewModel
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone {  get; set; }
        public double ExpYears { get; set; }        
        public EmployeeStatusEnum Status { get; set; }
        public int KPIPerDays { get; set; }
        public int CompletedOrders { get; set; }
        public TechnicianWorkingSessionEnum WorkingSessionStatus { get; set; }
        public IEnumerable<ServiceViewFormModel> Skills { get; set; }
    }
}

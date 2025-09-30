using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.ServiceCenter
{
    public class ServiceCenterViewModel
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public TimeSpan? OpenTime { get; set; }
        public TimeSpan? CloseTime { get; set; }
        public string? Hotline { get; set; }
    }
}

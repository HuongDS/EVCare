using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;

namespace DataAccess.Dtos.ServiceCategory
{
    public class ServiceCategoryViewModel
    {
        public string Name { get; set; }
        public IEnumerable<ServiceViewFormModel> Services { get; set; }
    }
}

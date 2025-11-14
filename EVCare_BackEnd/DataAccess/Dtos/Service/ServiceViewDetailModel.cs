using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Part;

namespace DataAccess.Dtos.Service {
    public class ServiceViewDetailModel : ServiceViewModel {
        public List<PartAdminViewModel> Parts { get; set; }
    }
}

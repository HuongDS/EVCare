using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Technician
{
    public class AssignTechniciansModel
    {
        public int OrderId {  get; set; }
        public IEnumerable<int> TechnicianIds {  get; set; }
    }
}

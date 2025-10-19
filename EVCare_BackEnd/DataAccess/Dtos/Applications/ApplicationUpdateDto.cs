using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Applications
{
    public class ApplicationUpdateDto
    {
        public int Id { get; set; }
        public ApplicationStatusEnum Status {get; set; }
    }
}

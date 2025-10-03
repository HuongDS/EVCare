using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.AI
{
    public class AIQueryDto
    {
        public int Lead { get; set; } = 5;
        public double sl { get; set; } = 0.95;
        public bool IncludeAll { get; set; } = true;
    }
}

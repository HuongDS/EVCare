using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Part
{
    public class PartUpdateModel
    {
        public int Id { get; set; }
        public string? Name { get; set; } = null;
        public int Quantity { get; set; }
    }
}

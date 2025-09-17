using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Service
{
    public class ServiceViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Duration { get; set; }
        public bool IsDeleted { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Part
{
    public class PartViewModel
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public decimal ReplacementPrice { get; set; }
        public decimal Price { get; set; }
        public int CategoryId {  get; set; }
        public int ServiceId { get; set; }
        public bool IsDeleted { get; set; }
        public string ImageUrl { get; set; }
    }
}

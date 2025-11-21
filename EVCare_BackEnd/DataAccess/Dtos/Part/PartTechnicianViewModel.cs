using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Part
{
    public class PartTechnicianViewModel
    {
        public int TechnicianId { get; set; }
        public string TechnicianName {  get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal ReplacementPrice { get; set; }
        public int Stock{ get;set; }
        public DamageLevelEnum PartStatus { get; set; }
        public string ImageUrl { get; set; }
    }
}

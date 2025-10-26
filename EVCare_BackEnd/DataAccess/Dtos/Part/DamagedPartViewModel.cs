using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.Part {
    public class DamagedPartViewModel {
        public int Id { get; set; }
        public int PartCategoryId { get; set; }
        public string PartName { get; set; }
        public DamageLevelEnum DamageLevel { get; set; }
    }
}

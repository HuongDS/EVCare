using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;

namespace DataAccess.Dtos.PartHistory {
    public class PartHistoryViewModel {
        public string PartName { get; set; }
        public string PartCategoryName { get; set; }
        public string ImageUrl { get; set; }
        public string EmployeeName { get; set; }
        public ActionTypeEnum ActionType { get; set; }
        public DateTime ChangeDate { get; set; }
        public int OldQuantity { get; set; }
        public int NewQuantity { get; set; }
        public decimal OldUnitPrice { get; set; }
        public decimal NewUnitPrice { get; set; }
        public decimal OldReplacePrice { get; set; }
        public decimal NewReplacePrice { get; set; }
    }
}

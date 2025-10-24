using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class PartHistory : IEntity
    {
        public int Id { get; set; }
        public int PartId { get; set; }
        public Part Part { get; set; }
        public int OldQuantity { get; set; }
        public int NewQuantity { get; set; }
        public decimal OldUnitPrice { get; set; }
        public decimal NewUnitPrice { get; set; }
        public decimal OldReplacePrice { get; set; }
        public decimal NewReplacePrice { get; set; }
        public ActionTypeEnum ActionType { get; set; }
        public string EmployeeName { get; set; }
        public DateTime ChangeDate { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Part : IEntity, IDelete, ICreate, IUpdate, ICategory
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public PartCategory Category { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal ReplacementPrice { get; set; }
        public int Stock { get; set; }
        public string? Image { get; set; }
        public DateTime Deleted_At { get; set; }
        public DateTime Create_At { get; set; }
        public DateTime Updated_At { get; set; }
        public ICollection<OrderPart> OrderParts { get; set; }
        public ICollection<PartHistory> PartHistories { get; set; }
        public ICollection<ServicePart> ServiceParts { get; set; }
        public ICollection<AppointmentPartCondition> AppointmentPartConditions { get; set; }
        public ICollection<OrderDetailLog> OrderDetailLogs { get; set; }
    }
}

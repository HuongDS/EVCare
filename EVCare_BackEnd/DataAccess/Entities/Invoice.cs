using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Enums;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class Invoice : IEntity, ICreate, IUpdate
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public decimal Total_Price { get; set; }
        public long? OrderCode { get; set; }
        public PaymentMethodEnum Payment_Method { get; set; }
        public PaymentStatusEnum Status { get; set; }
        public DateTime Create_At { get; set; }
        public DateTime Updated_At { get; set; }
       


    }
}

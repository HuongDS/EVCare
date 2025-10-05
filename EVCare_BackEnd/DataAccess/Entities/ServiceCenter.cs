using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Entities
{
    public class ServiceCenter : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public int Capacity { get; set; }
        public int WorkSlot { get; set; }
        public int DailyBookingLimit { get; set; }
        public TimeSpan OpenTime { get; set; }
        public TimeSpan CloseTime { get; set; }
        public string Hotline {  get; set; }
        public DayOfWeek WorkStartDay { get; set; }
        public DayOfWeek WorkEndDay { get; set; }
    }
}

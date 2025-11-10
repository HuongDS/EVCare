using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Enums
{
    public enum OrderStatusChangeEventEnum
    {
        OrderConfirmed = 0,
        OrderStatusUpdate = 1,
        StaffConfirmed = 2,
        TechnicianDoneTask = 3,
    }
}

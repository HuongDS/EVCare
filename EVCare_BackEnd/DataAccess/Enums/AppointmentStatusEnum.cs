using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Enums
{
    public enum AppointmentStatusEnum
    {
        Pending,
        Confirmed,
        CheckedIn,
        AddingPart,
        InProgress,
        ReadyForPickup,
        Done,
        Canceled
    }
}

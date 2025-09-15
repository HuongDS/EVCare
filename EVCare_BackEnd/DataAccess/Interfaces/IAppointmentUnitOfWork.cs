using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Interfaces
{
    internal interface IAppointmentUnitOfWork
    {
        ICustomerRepository Customers { get; }
        IVehicleRepository Vehicles { get; }
        IAppointmentRepository Appointments { get; }
        IAppointmentServiceRepository AppointmentServices { get; }
        Task<int> SaveChangesAsync();
    }
}

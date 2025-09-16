using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IAppointmentServiceRepository 
    {
        public Task AddAppointmentServicesAsync(IEnumerable<AppointmentService> appointmentServices);
    }
}
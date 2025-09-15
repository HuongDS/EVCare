using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IAppointmentServiceRepository 
    { 
        Task AddAsync(AppointmentService entity);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Appointment;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IAppointmentRepository : IGenericRepository<Appointment>
    {
        public Task<IEnumerable<AppointmentViewModel>> GetAppointmentsByCustomerId(int customerId);
        public Task<IEnumerable<AppointmentViewModel>> GetAppointmentsWithPagination(int payload, int pageindex);
        public Task<AppointmentViewDetailModel> GetAppointmentWithDetails(int appointmentId);
    }
}

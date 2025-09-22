using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Appointment;
using DataAccess.Entities;
using DataAccess.Enums;

namespace DataAccess.Interfaces
{
    public interface IAppointmentRepository : IGenericRepository<Appointment>
    {
        Task<(IEnumerable<Appointment>, int, int)> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, DateOnly currentDate, int pageSize, int pageIndex);
        Task<(IEnumerable<Appointment>, int, int)> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, int pageSize, int pageIndex);
        Task UpdateAppointmentStatusAsync(int appointmentID, AppointmentStatusEnum status);
        public Task<IEnumerable<AppointmentViewModel>> GetAppointmentsByCustomerId(int customerId);
        public Task<IEnumerable<AppointmentViewModel>> GetAppointmentsWithPagination(int payload, int pageindex);
        public Task<AppointmentViewDetailModel> GetAppointmentWithDetails(int appointmentId);
        Task<int> GetCurrentSlotAsync();
        Task<(IEnumerable<Appointment>, int, int)> GetAppointmentInDayWithPaginationAsync(DateTime date, int pageSize, int pageIndex);
        Task<Appointment> GetAppointmentByOrderIdAsync(int orderId);
        Task<(IEnumerable<Appointment>, int, int)> GetAppointmentBeforeDayAsync(DateTime date, int pageSize, int pageIndex);
        Task<Appointment> UpdateAppointmentDate(DateTime date, int appointmentId);
    }
}

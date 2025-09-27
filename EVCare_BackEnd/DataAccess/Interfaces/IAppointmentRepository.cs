using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Appointment;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Dtos.CenterCare;

namespace DataAccess.Interfaces
{
    public interface IAppointmentRepository : IGenericRepository<Appointment>
    {
        Task<PageResultDto<Appointment>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, DateOnly currentDate, int pageSize, int pageIndex);
        Task<PageResultDto<Appointment>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, int pageSize, int pageIndex);
        Task UpdateAppointmentStatusAsync(int appointmentID, AppointmentStatusEnum status);
        public Task<IEnumerable<AppointmentViewModel>> GetAppointmentsByCustomerId(int customerId);
        public Task<PageResultDto<AppointmentViewModel>> GetAppointmentsWithPagination(int payload, int pageindex);
        public Task<AppointmentViewDetailModel> GetAppointmentWithDetails(int appointmentId);
        Task<int> GetCurrentSlotAsync();
        Task<PageResultDto<Appointment>> GetAppointmentInDayWithPaginationAsync(DateTime date, int pageSize, int pageIndex);
        Task<Appointment> GetAppointmentByOrderIdAsync(int orderId);
        Task<PageResultDto<Appointment>> GetAppointmentBeforeDayAsync(DateTime date, int pageSize, int pageIndex);
        Task<Appointment> UpdateAppointmentDate(DateTime date, int appointmentId);
        public Task<int> CountAppointmentsPerDay(int customerId);
        public Task<int> CountAppointmnetToday();
        Task<CenterDailyCapacityModel> GetAppointmentWithDailyCount(int v, DateOnly today);
        Task CancelAppointment();
    }
}

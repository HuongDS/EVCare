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
using DataAccess.Dtos.Payment;
using DataAccess.Dtos.Service;
using DataAccess.Dtos.Part;
using DataAccess.Dtos.AppointmentService;

namespace DataAccess.Interfaces
{
    public interface IAppointmentRepository : IGenericRepository<Appointment>
    {
        Task<PageResultDto<Appointment>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, DateOnly currentDate, int pageSize, int pageIndex);
        Task<PageResultDto<Appointment>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, int pageSize, int pageIndex);
        Task UpdateAppointmentStatusAsync(int appointmentID, AppointmentStatusEnum status);
        public Task<IEnumerable<AppointmentViewModel>> GetAppointmentsByCustomerId(int customerId);
        public Task<PageResultDto<AppointmentViewModel>> GetAppointmentsWithPagination(int payload, int pageindex, string customerName);
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
        Task<PageResultDto<AppointmentViewModel>> GetWithPaginationAsync(AppointmentQueryDto model);
        Task<PageResultDto<AppointmentTechnicianViewModel>> GetAppointmentTechnicianViewModelByTechnicianId(int technicianId, AppointmentTechnicianQueryDto model);
        Task<int> CountAppointment(DateOnly appointment_Date);
        Task<PaymentPendingPickupEmailModel> GetPaymentPendingPickupEmailModel(int id);
        Task<bool> CheckAllReadyForPickup(int vehicleId);
        Task<IEnumerable<int>> GetAppointmentReadyForPickUpByVehicleId(int vehicleId);
        Task<PageResultDto<AppointmentInProgressUnderstaffedViewModel>> GetUnderstaffedInProgressAsync(AppointmentQueryDto model);
        Task<int> CountAppointmentsInMonth(int year, int month);
        Task<int> CountCustomersInMonth(int year, int month);
        Task<int> CountAppointmentsInMonthWithStatus(int year, int month, AppointmentStatusEnum status);
        Task <Appointment> GetByOrderIdAsync(int orderId);
        Task<AppointmentVehicleViewModel> GetVehicleByAppointmentId(int appointmentId);
        Task<IEnumerable<ServiceSummaryViewModel>> GetTopServicesAsync(ServiceSummaryQueryDto model);
        Task<bool> CheckInValidVehicleID(int vehicleId);
        Task<IEnumerable<AppointmentServiceViewModel>> GetAppointmentServices(int appointmentId);
        Task<IEnumerable<int>> GetPartIdsInAppointment(int appointmentId);
    }
}

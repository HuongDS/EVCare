using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using DataAccess.Dtos.Applications;
using DataAccess.Dtos.Appointment;
using DataAccess.Dtos.CenterCare;
using DataAccess.Dtos.Pagination;
using DataAccess.Entities;
using DataAccess.Enums;

namespace Application.Interfaces
{
    public interface IAppointmentService
    {

        Task<PageResultDto<AppointmentViewDto>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, DateOnly currentDate, int pageSize, int pageIndex);
        Task<PageResultDto<AppointmentViewDto>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, int pageSize, int pageIndex);
        Task<int> UpdateAppointmentStatus(AppointmentUpdateDto data);
        Task<int> CreateAppointment(AppointmentCreateModel model);
        Task<bool> UpdateAppointment(AppointmentUpdateModel model, int employeeId);
        Task<bool> DeleteAppointment(int appointmentId);
        Task<AppointmentViewDetailModel> GetAppointmentById(int appointmentIdId);
        Task<IEnumerable<AppointmentViewModel>> GetAppointmentHistoryByCustomerId(int customerId);
        Task<PageResultDto<AppointmentViewModel>> GetAppointmentsWithPagination(AppointmentQueryDto model);
        Task<ResponseDto<PageResultDto<AppointmentViewDto>>> GetAppointmentInCurrentDay(int pageSize, int pageIndex);
        Task<ResponseDto<PageResultDto<AppointmentViewDto>>> GetAppointmentBeforeDayAsync(DateTime date, int pageSize, int pageIndex);
        Task<ResponseDto<AppointmentViewDto>> UpdateAppointmentDateAsync(DateTime date, int appointmentId);
        Task<AppointmentInforToSentDto> GetAppointmentInforToAsync(int appointmentId);
        Task<CenterDailyCapacityModel> GetAppointmentWithCountDaily();
        Task <PageResultDto<AppointmentTechnicianViewModel>> GetAppointmentByTechnicianId(int technicianId, AppointmentTechnicianQueryDto model);
        Task<PageResultDto<AppointmentInProgressUnderstaffedViewModel>> GetUnderstaffedInProgressAsync(AppointmentQueryDto model);
        Task<int> CountAppointmentsInMonths(int year, int month);
        Task<int> CountCustomersInMonths(int year, int month);
        Task<int> CountAppointmentsInMonthsWithStatus(int year, int month, AppointmentStatusEnum status);
        Task<AppointmentVehicleViewModel> GetVehicleByAppointmentId(int appointmentId);
        Task<int> CreateAppointmentForStaff(AppointmentCreateModel model, int employeeId);
    }
}

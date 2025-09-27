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
        Task<AppointmentViewDetailModel> GetAppointmentByiD(int appointmentIdId);
        Task<IEnumerable<AppointmentViewModel>> GetAppointmentHistoryByCustomerId(int customerId);
        Task<PageResultDto<AppointmentViewModel>> GetAppointmentsWithPagination(int? payload, int? pageindex);
        Task<ResponseDto<PageResultDto<AppointmentViewDto>>> GetAppointmentInCurrentDay(int pageSize, int pageIndex);
        Task<ResponseDto<PageResultDto<AppointmentViewDto>>> GetAppointmentBeforeDayAsync(DateTime date, int pageSize, int pageIndex);
        Task<ResponseDto<AppointmentViewDto>> UpdateAppointmentDateAsync(DateTime date, int appointmentId);
        Task<AppointmentInforToSentDto> GetAppointmentInforToAsync(int appointmentId);
        Task<CenterDailyCapacityModel> GetAppointmentWithCountDaily();

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Appointment;
using DataAccess.Dtos.Pagination;
using DataAccess.Entities;
using DataAccess.Enums;

namespace Application.Interfaces
{
    public interface IAppointmentService
    {
        Task<int> CreateAppointment(AppointmentCreateModel model);
        Task<PageResultDto<AppointmentViewDto>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, DateOnly currentDate, int pageSize, int pageIndex);
        Task<PageResultDto<AppointmentViewDto>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, int pageSize, int pageIndex);
        Task<int> UpdateAppointmentStatus(AppointmentUpdateDto data);
    }
}

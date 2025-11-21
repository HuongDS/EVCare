using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.AppointmentPartCondition;

namespace Application.Interfaces {
    public interface IAppointmentPartConditionService {
        Task CreateAppointmentPartConditionAsync(AppointmentPartConditionCreateModel dto, int technicianId);
        Task<AppointmentPartConditionViewModel> GetAppointmentPartConditionsAsync(int appointmentId, int technicianId);
        Task UpdateAppointmentPartConditionAsync(AppointmentPartConditionCreateModel dto, int technicianId);
        Task UpdateAppointmentPartConditionStatusAsync(int technicianId, int appointmentId);
    }
}

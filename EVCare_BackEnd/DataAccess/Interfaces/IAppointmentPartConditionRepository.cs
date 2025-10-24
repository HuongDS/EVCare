using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.AppointmentPartCondition;
using DataAccess.Entities;

namespace DataAccess.Interfaces {
    public interface IAppointmentPartConditionRepository {
        Task CreateAppointmentPartConditionAsync(AppointmentPartCondition appointmentPartCondition);
        Task DeleteAppointmentPartConditionsByAppointmentIdAsync(int appointmentId, int technicianId);
        Task<AppointmentPartConditionViewModel> GetAppointmentPartConditionsAsync(int appointmentId, int technicianId);
    }
}

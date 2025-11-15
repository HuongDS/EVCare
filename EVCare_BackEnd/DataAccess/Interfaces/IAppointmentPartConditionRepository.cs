using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.AppointmentPartCondition;
using DataAccess.Entities;
using DataAccess.Enums;

namespace DataAccess.Interfaces {
    public interface IAppointmentPartConditionRepository {
        Task CreateAppointmentPartConditionAsync(AppointmentPartCondition appointmentPartCondition);
        Task DeleteAppointmentPartConditionsByAppointmentIdAsync(int appointmentId, int technicianId);
        Task<AppointmentPartConditionViewModel> GetAppointmentPartConditionsAsync(int appointmentId, int technicianId);
        Task<AppointmentPartCondition> GetAppointmentPartConditionsByTechIdAndPartIdAndAppointmentIdAsync(int orderId, int partId, int technicianId);
        Task<DamageLevelEnum?> GetAppointmentPartConditionsByTechIdAndOrderIdAsync(int partId, int technicianId);
        Task RemoveByAppointmentIdAsync(int id);
        Task UpdateAsync(AppointmentPartCondition appoimentPartConditions);
        Task<IEnumerable<AppointmentPartCondition>> GetAppointmentPartConditionsByTechIdAndAppointmentId(int appointmentId, int technicianId);
    }
}

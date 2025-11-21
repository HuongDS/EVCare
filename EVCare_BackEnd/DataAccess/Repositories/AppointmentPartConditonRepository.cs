using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.AppointmentPartCondition;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories {
    public class AppointmentPartConditonRepository : IAppointmentPartConditionRepository {
        public EVCareDbContext _dbcontext;
        public AppointmentPartConditonRepository(EVCareDbContext dbcontext) {
            _dbcontext = dbcontext;
        }
        public async Task CreateAppointmentPartConditionAsync(Entities.AppointmentPartCondition appointmentPartCondition) {
            await _dbcontext.AppointmentPartConditions.AddAsync(appointmentPartCondition);
        }

        public async Task DeleteAppointmentPartConditionsByAppointmentIdAsync(int appointmentId, int technicianId) {
            await  _dbcontext.AppointmentPartConditions
                .Where(apc => apc.AppointmentId == appointmentId && apc.TechicianId == technicianId)
                .ExecuteDeleteAsync();
        }

        public async Task<AppointmentPartConditionViewModel> GetAppointmentPartConditionsAsync(int appointmentId, int technicianId) {
            var parts = await _dbcontext.AppointmentPartConditions.
                Where(a => a.AppointmentId == appointmentId && a.TechicianId == technicianId)
                .Include(a=>a.Appointment).ThenInclude(a=>a.Order).ThenInclude(a=>a.OrderParts)
                .Include(a => a.Part)
                .Select(a => new AppointmentPartDamageLevelViewModel {
                    PartId = a.PartId,
                    DamageLevel = a.Level,
                    PartName = a.Part.Name,
                    PartUrl = a.Part.Image,
                    Quantity = a.Appointment.Order.OrderParts
                                    .Where(op => op.PartId == a.PartId && op.TechnicianId == technicianId)
                                    .FirstOrDefault().Quantity,
                    Price = a.Appointment.Order.OrderParts
                                    .Where(op => op.PartId == a.PartId && op.TechnicianId == technicianId)
                                    .FirstOrDefault().Price,
                    IsReplaced = a.Appointment.Order.OrderParts
                                    .Where(op => op.PartId == a.PartId && op.TechnicianId == technicianId)
                                    .FirstOrDefault().IsReplaced

                }).ToListAsync();
                    return new AppointmentPartConditionViewModel
                    {
                        AppointmentId = appointmentId,
                        PartDamageLevels = parts
                    };
           }

        public async Task<AppointmentPartCondition> GetAppointmentPartConditionsByTechIdAndPartIdAndAppointmentIdAsync(int appointmentId, int partId, int technicianId) {
            return await _dbcontext.AppointmentPartConditions
                .Where(apc => apc.AppointmentId == appointmentId
                    && apc.PartId == partId 
                    && apc.TechicianId == technicianId)
                .FirstOrDefaultAsync();

        }

        public async Task<DamageLevelEnum?> GetAppointmentPartConditionsByTechIdAndOrderIdAsync(int appointmentId,int partId, int technicianId) {
            
            return await _dbcontext.AppointmentPartConditions
                .Where(apc => apc.PartId == partId && apc.TechicianId == technicianId)
                .Select(apc => apc.Level)
                .FirstOrDefaultAsync();

        }

        public async Task RemoveByAppointmentIdAsync(int id) {
            await _dbcontext.AppointmentPartConditions
                .Where(apc => apc.AppointmentId == id)
                .ExecuteDeleteAsync();
        }

        public async Task UpdateAsync(AppointmentPartCondition appoimentPartConditions) {
            _dbcontext.AppointmentPartConditions.Update(appoimentPartConditions);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task<IEnumerable<AppointmentPartCondition>> GetAppointmentPartConditionsByTechIdAndAppointmentId(int appointmentId, int technicianId) {
            
            return await _dbcontext.AppointmentPartConditions
                .Where(apc => apc.AppointmentId == appointmentId && apc.TechicianId == technicianId)
                .ToListAsync();
        }
    }
}

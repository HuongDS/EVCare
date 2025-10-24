using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.AppointmentPartCondition;
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
                .Include(a => a.Part)
                .Select(a => new AppointmentPartDamageLevelViewModel {
                    PartId = a.PartId,
                    DamageLevel = a.Level,
                    PartName = a.Part.Name,
                    PartUrl = a.Part.Image

                }).ToListAsync();
                    return new AppointmentPartConditionViewModel
                    {
                        AppointmentId = appointmentId,
                        PartDamageLevels = parts
                    };
           }
    }
}

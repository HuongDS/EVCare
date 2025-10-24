using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.AppointmentPartCondition;
using DataAccess.Interfaces;

namespace Application.Services {
    public class AppointmentPartConditionService : IAppointmentPartConditionService {
        private readonly IAppointmentPartConditionRepository _appointmentPartConditionRepository;
        private readonly IUnitOfWork _unitOfWork;
        public AppointmentPartConditionService(
            IAppointmentPartConditionRepository appointmentPartConditionRepository
            ,IUnitOfWork unitOfWork
            ) {
            _appointmentPartConditionRepository = appointmentPartConditionRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task CreateAppointmentPartConditionAsync(AppointmentPartConditionCreateModel dto, int technicianId) {
           await  _unitOfWork.ExecuteInTransactionAsync(async () => {
                foreach (var partDamageLevel in dto.PartDamageLevels) {
                    await _appointmentPartConditionRepository.CreateAppointmentPartConditionAsync(new DataAccess.Entities.AppointmentPartCondition {
                        AppointmentId = dto.AppointmentId,
                        PartId = partDamageLevel.PartId,
                        Level = partDamageLevel.LevelEnum,
                        TechicianId = technicianId
                    });
                }
            });
        }

        public async Task<AppointmentPartConditionViewModel> GetAppointmentPartConditionsAsync(int appointmentId, int technicianId) {
            return await _appointmentPartConditionRepository.GetAppointmentPartConditionsAsync(appointmentId, technicianId);
        }

        public async Task UpdateAppointmentPartConditionAsync(AppointmentPartConditionCreateModel dto, int technicianId) {
            await _unitOfWork.ExecuteInTransactionAsync(async () => {
                 
                await _appointmentPartConditionRepository.DeleteAppointmentPartConditionsByAppointmentIdAsync(dto.AppointmentId,technicianId);

                foreach (var partDamageLevel in dto.PartDamageLevels) {
                    await _appointmentPartConditionRepository.CreateAppointmentPartConditionAsync(new DataAccess.Entities.AppointmentPartCondition {
                        AppointmentId = dto.AppointmentId,
                        PartId = partDamageLevel.PartId,
                        Level = partDamageLevel.LevelEnum,
                        TechicianId = technicianId
                    });
                }
            });
        }
    }
}

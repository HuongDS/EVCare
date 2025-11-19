using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.TechnicianSkill;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class TechnicianSkillService : ITechnicianSkillService
    {
        private readonly ITechnicianSkillRepository _technicianSkillRepository;
        private readonly IUnitOfWork _unitOfWork;
        public TechnicianSkillService(ITechnicianSkillRepository technicianSkillRepository, IUnitOfWork unitOfWork) {
            _technicianSkillRepository = technicianSkillRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task AddTechnicianSkillAsync(TechnicianSkillCreateModel model)
        {
            var technicianSkills = model.ServiceIds.Select(serviceId => new DataAccess.Entities.TechnicianSkill
            {
                TechnicianId = model.TechnicianId,
                ServiceId = serviceId
            });
            await _technicianSkillRepository.AddTechnicianSkillAsync(technicianSkills);
        }

        public async Task UpdateTechnicianSkillAsync(TechnicianSkillCreateModel model) {
            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                await _technicianSkillRepository.DeleteTechnicianSkillByTechnicianIdAsync(model.TechnicianId);
                var technicianSkills = model.ServiceIds.Select(serviceId => new DataAccess.Entities.TechnicianSkill
                {
                    TechnicianId = model.TechnicianId,
                    ServiceId = serviceId
                });
                await _technicianSkillRepository.AddTechnicianSkillAsync(technicianSkills);
            });

        }
    }
}

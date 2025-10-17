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
        public TechnicianSkillService(ITechnicianSkillRepository technicianSkillRepository)
        {
            _technicianSkillRepository = technicianSkillRepository;
        }
        public async Task AddTechnicianSkillAsync(TechnicianSkillCreateModel model)
        {
            if (model.ServiceId.HasValue)
            {
                await _technicianSkillRepository.AddTechnicianSkillAsync(model);
                return;
            }
            var listServiceIds = await _technicianSkillRepository.GetServiceIdsByCategoryIdAsync(model.TechnicianCategoryId);
            foreach (var serviceId in listServiceIds)
            {
                var technicianSkillModel = new TechnicianSkillCreateModel
                {
                    TechnicianId = model.TechnicianId,
                    TechnicianCategoryId = model.TechnicianCategoryId,
                    ServiceId = serviceId
                };
                await _technicianSkillRepository.AddTechnicianSkillAsync(technicianSkillModel);
            }
        }
    }
}

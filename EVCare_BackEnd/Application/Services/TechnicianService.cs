using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Technician;
using DataAccess.Enums;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class TechnicianService : ITechnicianService
    {
        private readonly ITechnicianRepository _technicianRepository;
        public TechnicianService(ITechnicianRepository technicianRepository)
        {
            _technicianRepository = technicianRepository;
        }

        public async Task<TechnicianViewModel> GetTechnicianDetail(int technicianId)
        {
            return await _technicianRepository.GetTechnicianDetai(technicianId);
        }

        public async Task<PageResultDto<TechnicianViewModel>> GetTechnicianToday(TechnicianQueryDto model)
        {
            return await _technicianRepository.GetTechniciansAsync(model);
        }
        public async Task<IEnumerable<TechnicianCusViewModel>> GetTechniciansByOrderId(int orderId)
        {
            return await _technicianRepository.GetTechniciansByOrderId(orderId);
        }

        public async Task<int> GetTechnicianStatus(EmployeeStatusEnum? status) {
             return await _technicianRepository.GetTechnicianStatus(status);
        }
    }
}

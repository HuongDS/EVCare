using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Technician;
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

        public async Task<PageResultDto<TechnicianViewModel>> GetTechnicianToday(TechnicianQueryDto model)
        {
            return await _technicianRepository.GetTechniciansAsync(model);
        }
    }
}

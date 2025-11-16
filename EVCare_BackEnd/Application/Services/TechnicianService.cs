using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Dtos.Technician;
using DataAccess.Enums;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class TechnicianService : ITechnicianService
    {
        private readonly ITechnicianRepository _technicianRepository;
        private readonly IOrderPartRepository _orderPartRepository;
        public TechnicianService(ITechnicianRepository technicianRepository, IOrderPartRepository orderPartRepository   )
        {
            _technicianRepository = technicianRepository;
            _orderPartRepository = orderPartRepository;
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

        public async Task UpdateTechnicianProfile(int technicianId, TechnicianUpdateModel model) {
           var technician = await  _technicianRepository.GetByIdAsync(technicianId);
            if (technician == null) {
                throw new Exception("Technician not found.");
             }
            technician.ExpYear = model.ExpYears;
            technician.KPIPerDays = model.KPIPerDays;
            await _technicianRepository.UpdateAsync(technician);
            

        }

        public async Task<IEnumerable<PartTechnicianViewModel>> GetTechnicianPendingParts(TechnicianPendingPartModel query) {
             var parts = await _orderPartRepository.GetTechnicianPendingParts(query);
             return parts;
        }
    }
}

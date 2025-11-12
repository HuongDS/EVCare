using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Technician;
using DataAccess.Enums;

namespace Application.Interfaces
{
    public interface ITechnicianService
    {
        Task<TechnicianViewModel> GetTechnicianDetail(int technicianId);
        Task<IEnumerable<TechnicianCusViewModel>> GetTechniciansByOrderId(int orderId);
        Task<int> GetTechnicianStatus(EmployeeStatusEnum? status);

        //Task<IEnumerable<>>
        Task<PageResultDto<TechnicianViewModel>> GetTechnicianToday(TechnicianQueryDto model);
        Task UpdateTechnicianProfile(int technicianId, TechnicianUpdateModel model);
    }
}

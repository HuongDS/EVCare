using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Technician;
using DataAccess.Entities;
using DataAccess.Enums;

namespace DataAccess.Interfaces
{
    public interface ITechnicianRepository : IGenericRepository<Technician>
    {
        Task<Technician> GetTechnicianByEmployeeID(int employeeID);
        Task<PageResultDto<TechnicianViewModel>> GetTechniciansAsync(TechnicianQueryDto model);

        Task<int> GetTechnicianIdByAccountId(int accountId);
        Task<TechnicianViewModel> GetTechnicianDetai(int technicianId);
        Task<IEnumerable<TechnicianCusViewModel>> GetTechniciansByOrderId(int orderId);
        Task<int> GetTechnicianStatus(EmployeeStatusEnum? status);
        Task UpdateCompletedOrderAsync();
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Employees;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Technicians;

namespace Application.Interfaces
{
    public interface IEmployeeServices
    {
        Task AssignOrderToTechnicianAsync(AssignTechnicianDto data);
        Task<(int, int)> CheckSlotsAsync();
        Task<PageResultDto<EmployeeViewModel>> GetAllEmployeesAsync(EmployeeQueryDto query);
        Task<EmployeeCustomerViewModel> GetEmployeeDetailsByIdAsync(int employeeId);
        Task<int> GetEmployeeIdByAccountId(int accountId);
        Task<EmployeeViewModel> GetEmployeeInformation(int employeeId);
    }
}

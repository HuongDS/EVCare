using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IEmployeeRepository : IGenericRepository<Employee>
    {
        Task<Employee> GetEmployeeByAccountId(int userId);
        Task<Employee> GetEmployeeByTechnicianId(int technicianId);
        Task MarkAvaliableAllEmployees();
        Task MarkBusyForTechnician(IEnumerable<int> technicianIds);
        Task MarkBusyForTechnician();
    }
}

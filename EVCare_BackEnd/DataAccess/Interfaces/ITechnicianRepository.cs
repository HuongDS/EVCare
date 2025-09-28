using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Technician;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface ITechnicianRepository : IGenericRepository<Technician>
    {
        Task<Technician> GetTechnicianByEmployeeID(int employeeID);
        Task<IEnumerable<TechnicianViewModel>> GetTechniciansAsync(string[]? sortField, string[]?sortOrder,int payload,int payindex);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class TechnicianRepository : GenericRepository<Technician>, ITechnicianRepository
    {
        public TechnicianRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<Technician> GetTechnicianByEmployeeID(int employeeID)
        {
            var entity = await _dbContext.Technicians.FirstOrDefaultAsync(t => t.EmployeeId == employeeID);
            if (entity == null)
            {
                throw new Exception($"Entity with EmployeeId = {employeeID} is not found.");
            }
            return entity;
        }
    }
}

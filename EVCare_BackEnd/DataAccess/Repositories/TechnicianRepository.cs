using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Technician;
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

        public async Task<IEnumerable<TechnicianViewModel>> GetTechniciansAsync(string[]? sortField, string[]? sortOrder, int payload,int payindex)
        {
            var now = DateTime.Now;
            var query =  _dbContext.Technicians
                .Include(x => x.Employee).ThenInclude(x => x.Applications)
                .Include(x => x.Employee).ThenInclude(x => x.Account)
                .Include(x => x.TechnicianSkills).ThenInclude(x => x.Service)
                .Include(x => x.TechnicianWorkingSessions)
                .AsNoTracking()
                .Select(x => new TechnicianViewModel
                {
                    FullName = x.Employee.Account.First_Name+" " +x.Employee.Account.Last_Name,
                    ExpYears = x.ExpYear,
                    Phone = x.Employee.Account.Phone,
                    Rating = x.Employee.rate,
                    Skills = x.TechnicianSkills.Select(x=>new Dtos.Service.ServiceViewFormModel
                    {
                        Id = x.ServiceId,
                        Name = x.Service.Name,
                    }),
                    Status = Enums.EmployeeStatusEnum.Available



                }).ToListAsync();

            return null;
        }
    }
}

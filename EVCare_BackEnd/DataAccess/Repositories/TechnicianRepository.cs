using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Service;
using DataAccess.Dtos.Technician;
using DataAccess.Entities;
using DataAccess.Helpers;
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

        public async Task<TechnicianViewModel> GetTechnicianDetai(int technicianId)
        {
            return await _dbContext.Technicians.AsNoTracking()
                .Where(x => x.Id == technicianId)
                .Include(x => x.Employee).ThenInclude(x => x.Account)
                .Include(x => x.TechnicianSkills).ThenInclude(x => x.Service)
                .Include(x=>x.TechnicianWorkingSessions)
                .Select(x => new TechnicianViewModel
                {
                    ExpYears = x.ExpYear,
                    FullName = x.Employee.Account.First_Name + " " + x.Employee.Account.Last_Name,
                    Phone = x.Employee.Account.Phone,
                    Skills = x.TechnicianSkills.Select(x => new ServiceViewFormModel
                    {
                        Id = x.ServiceId,
                        Name = x.Service.Name
                    }).ToList(),
                    Status = (x.TechnicianWorkingSessions.Any(y => y.TechnicianId == x.Id && y.EndTime == null)) ? Enums.EmployeeStatusEnum.Busy
                    : x.Employee.Status,

                }).FirstOrDefaultAsync();
        }

        public async Task<int> GetTechnicianIdByAccountId(int accountId)
        {
            var data = await _dbSet.Include(x=>x.Employee).ThenInclude(X=>X.Account)
                .AsNoTracking().Where(x=>x.Employee.Account.Id == accountId).FirstOrDefaultAsync();
            if(data == null)
            {
                throw new Exception("Souce not found");
            }
            return data.Id;
        }

        public async Task<PageResultDto<TechnicianViewModel>> GetTechniciansAsync(TechnicianQueryDto model)
        {

            var query = _dbContext.Technicians
                .Include(x => x.Employee).ThenInclude(x => x.Account)
                .Include(x => x.TechnicianSkills).ThenInclude(x => x.Service)
                .Include(x => x.TechnicianWorkingSessions)
                .AsNoTracking()
                .Where(x => x.Employee.Account.Deleted_At == DateTime.MinValue)
                .Select(x => new TechnicianViewModel
                {
                    Id = x.Id,
                    FullName = x.Employee.Account.First_Name + " " + x.Employee.Account.Last_Name,
                    ExpYears = x.ExpYear,
                    Phone = x.Employee.Account.Phone,
                    Skills = x.TechnicianSkills.Select(x => new Dtos.Service.ServiceViewFormModel
                    {
                        Id = x.ServiceId,
                        Name = x.Service.Name,
                    }),
                    Status = x.Employee.Status

                })
                .Where(x=>x.Status == model.Status);
            if (model.Skills != null) query = query.Where(x => x.Skills.Any(s => model.Skills.Contains(s.Id)));
            if(!string.IsNullOrEmpty(model.FullName))
            {
                query = query.Where(x => (x.FullName).ToLower().Contains(model.FullName.ToLower()));
            }
            query = query.ApplySorting(model.SortField,model.SortOrder);
            
            return await PaginationHelper.PaginationAsync(query,model.PageSize.Value,model.PageIndex.Value);
        }
    }
}

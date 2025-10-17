using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.ServiceCategory;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class ServiceCategoryRepository : IServiceCategoryRepository
    {
        private readonly EVCareDbContext _db;
        public ServiceCategoryRepository(EVCareDbContext db)
        {
            _db = db;
        }
        public async Task<IEnumerable<ServiceCategoryViewModel>> GetServiceCategoryAndService()
        {
            return await _db.TechnicianSkills.AsNoTracking().
                Include(x => x.Service)
                .Include(x => x.TechnicianCategories)
                .Where(x=>x.TechnicianCategories.Deleted_At==DateTime.MinValue)
                .GroupBy(x => x.TechnicianCategories.Name)
                .Select(g => new ServiceCategoryViewModel
                {
                    Name = g.Key,
                    Services = g.Where(x=>x.Service.Deleted_At==null)
                    .Select(x => new Dtos.Service.ServiceViewFormModel
                    {
                        Id = x.ServiceId,
                        Name = x.Service.Name,
                    }).Distinct().ToList()


                })
                .ToListAsync();
        }
    }
}

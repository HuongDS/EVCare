using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;
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
            return await _db.ServiceCategories     
                .Select(sc => new ServiceCategoryViewModel
                { 
                    Name = sc.Name,
                    Services = sc.Services.Select(s => new ServiceViewFormModel
                    {
                        Id = s.Id,
                        Name = s.Name,
                    
                    }).ToList()

                }).ToListAsync();
        }
    }
}

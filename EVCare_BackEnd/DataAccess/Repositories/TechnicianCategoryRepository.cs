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
    public class TechnicianCategoryRepository : GenericRepository<TechnicianCategory>, ITechnicianCategoryRepository
    {
        public TechnicianCategoryRepository(EVCareDbContext dbContext, DbSet<TechnicianCategory> dbSet) : base(dbContext, dbSet)
        {
        }
    }


}

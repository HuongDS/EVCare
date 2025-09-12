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
    public class PartCategoryRepository : GenericRepository<PartCategory>, IPartCategoryRepository
    {
        public PartCategoryRepository(EVCareDbContext dbContext, DbSet<PartCategory> dbSet) : base(dbContext, dbSet)
        {
        }
    }
}

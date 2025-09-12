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
    public class PartCategoryGenericRepository : GenericCategoryRepository<Part>, IPartGenericCategoryRepository
    {
        public PartCategoryGenericRepository(EVCareDbContext dbContext, DbSet<Part> dbSet) : base(dbContext, dbSet)
        {
        }
    }
}

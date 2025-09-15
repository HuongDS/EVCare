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
    public class PartRepository : GenericCategoryRepository<Part>, IPartRepository
    {
        public PartRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
    }
}

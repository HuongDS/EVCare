using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.Entities;
using DataAccess.Interfaces;
using DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;



public class VehicleGenericCategoryRepository : GenericCategoryRepository<Vehicle>, IVehicleGenericCategoryRepository
{
    public VehicleGenericCategoryRepository(EVCareDbContext dbContext, DbSet<Vehicle> dbSet) : base(dbContext, dbSet)
    {
    }
}


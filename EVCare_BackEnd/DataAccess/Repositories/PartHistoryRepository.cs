using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Interfaces;

namespace DataAccess.Repositories {
    public class PartHistoryRepository : GenericRepository<PartHistory>, IPartHistoryRepository {
        public PartHistoryRepository(EVCareDbContext dbContext) : base(dbContext) {
        }
        public override async Task<PartHistory> AddAsync(PartHistory entity) {
            await _dbContext.PartHistories.AddAsync(entity);
            return entity;
        }
    }
}

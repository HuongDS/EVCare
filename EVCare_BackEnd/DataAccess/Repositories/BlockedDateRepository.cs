using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.BlockedDate;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class BlockedDateRepository : GenericRepository<CenterUnavailableDays>, IBlockedDateRepository
    {
        public BlockedDateRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<BlockedDateViewModel>> GetBlockedDateFromToday()
        {
            return await _dbSet.Where(x => x.Date > DateTime.Now)
                .Select(x=>new BlockedDateViewModel
                {
                    DateTime= x.Date,
                } )
                .ToListAsync();
        }
    }
}

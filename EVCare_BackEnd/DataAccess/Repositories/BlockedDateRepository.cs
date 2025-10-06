using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.BlockedDate;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace DataAccess.Repositories
{
    public class BlockedDateRepository : GenericRepository<CenterUnavailableDays>, IBlockedDateRepository
    {
        public BlockedDateRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<BlockedDateViewModel>> GetBlockedDateFromToday()
        {
            var lists =  await _dbSet.Where(x => x.Date > DateTime.Now)
                .Select(x=>new BlockedDateViewModel
                {
                    DateTime= DateOnly.FromDateTime(x.Date),
                    Reason = x.Reason,
                } )
                .ToListAsync();

            var capacity = await _dbContext.ServiceCenters.FirstOrDefaultAsync();
            var date = await _dbContext.Appointments
                .Where(x => x.Appointment_Date > DateTime.Now && x.Status!=Enums.AppointmentStatusEnum.Done && x.Status!=Enums.AppointmentStatusEnum.Canceled)
                .GroupBy(x => DateOnly.FromDateTime(x.Appointment_Date))
                .Select(g => new { g.Key, Count = g.Count() })
                .Where(x => x.Count >= capacity.Capacity)
                .OrderBy(x => x.Key)
                .Select(x => new BlockedDateViewModel
                {
                    DateTime = x.Key,
                    Reason = "Too limit capacity"
                }).ToListAsync();

            lists.AddRange(date);
            return lists.OrderBy(x=>x.DateTime);

        }
    }
}

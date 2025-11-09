using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.BlockedDate;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IBlockedDateRepository : IGenericRepository<CenterUnavailableDays>
    {
        public Task<IEnumerable<BlockedDateViewModel>> GetBlockedDateFromToday();
        Task<CenterUnavailableDays> GetByDate(DateOnly date);
    }
}

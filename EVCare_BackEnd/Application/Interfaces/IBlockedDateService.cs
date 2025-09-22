using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.BlockedDate;

namespace Application.Interfaces
{
    public interface IBlockedDateService
    {
        public Task<IEnumerable<BlockedDateViewModel>> GetBlockedDateFromToday();

    }
}

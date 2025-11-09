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
        public Task<int> CreatePost(BlockedDatePostModel model);
        Task DeleteBlockedDate(DateOnly date);
        public Task<IEnumerable<BlockedDateViewModel>> GetBlockedDateFromToday();
        Task UpdateBlockedDate(BlockedDatePostModel model);
    }
}

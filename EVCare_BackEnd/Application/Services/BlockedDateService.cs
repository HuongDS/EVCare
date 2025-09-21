using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.BlockedDate;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class BlockedDateService : IBlockedDateService
    {
        private readonly IBlockedDateRepository _blockedDateRepository;
        public BlockedDateService(IBlockedDateRepository blockedDateRepository)
        {
            _blockedDateRepository = blockedDateRepository; 
        }

        public async Task<IEnumerable<BlockedDateViewModel>> GetBlockedDateFromToday()
        {
            return await _blockedDateRepository.GetBlockedDateFromToday();
        }
    }
}

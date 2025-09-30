using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class PartService : IPartService
    {
        private readonly IPartRepository _partRepository;
        public PartService(IPartRepository partRepository)
        {
            _partRepository = partRepository;
        }

        public async Task<PageResultDto<PartViewModel>> GetAllParts(PartQueryDto model)
        {
            return await _partRepository.GetAllParts(model);
        }
    }
}

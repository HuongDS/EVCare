using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Technician;

namespace Application.Interfaces
{
    public interface ITechnicianService
    {
        //Task<IEnumerable<>>
        Task<PageResultDto<TechnicianViewModel>> GetTechnicianToday(TechnicianQueryDto model);
    }
}

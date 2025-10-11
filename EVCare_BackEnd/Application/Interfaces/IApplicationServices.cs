using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using DataAccess.Dtos.Applications;
using DataAccess.Dtos.Pagination;

namespace Application.Interfaces
{
    public interface IApplicationServices
    {
        Task<int> CreateApplicationAsync(ApplicationCreateDto createData);
        Task<PageResultDto<ApplicationViewDto>> GetApplicationAsync(ApplicationQueryDto query, int employeeId);
        Task<List<DateOnly>> GetDateOffAsync(int employeeId);
        Task<ResponseDto<ApplicationViewDto>> SendApplicationAsync(ApplicationCreateDto data);
    }
}

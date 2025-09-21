using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using DataAccess.Dtos.Applications;

namespace Application.Interfaces
{
    public interface IApplicationServices
    {
        Task<ResponseDto<ApplicationViewDto>> SendApplicationAsync(ApplicationCreateDto data);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Applications;
using DataAccess.Dtos.Pagination;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class ApplicationServices : IApplicationServices
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IMapper _mapper;

        public ApplicationServices(IApplicationRepository applicationRepository, IMapper mapper)
        {
            this._applicationRepository = applicationRepository;
            this._mapper = mapper;
        }

        public async Task<int> CreateApplicationAsync(ApplicationCreateDto createData)
        {
            var newApplication = _mapper.Map<DataAccess.Entities.Application>(createData);
            var application = await _applicationRepository.AddAsync(newApplication);
            return application.Id;
        }

        public async Task<PageResultDto<ApplicationViewDto>> GetApplicationAsync(ApplicationQueryDto query, int employeeId)
        {
            return await _applicationRepository.GetApplicationByEmployeeIdAsync(query, employeeId);
        }

        public async Task<List<DateOnly>> GetDateOffAsync(int employeeId)
        {
            return await _applicationRepository.GetDateoff(employeeId);
        }

        public async Task<ResponseDto<ApplicationViewDto>> SendApplicationAsync(ApplicationCreateDto data)
        {
            var check = await _applicationRepository.GetApplicationByEmployeeIDAndDateOffAsync(data.employeeID, data.dateOff);
            if (!check)
            {
                throw new Exception(Message.APPLICATION_ALREADY_EXISTS);
            }
            var newApplication = _mapper.Map<DataAccess.Entities.Application>(data);
            await _applicationRepository.AddAsync(newApplication);
            var result = new ResponseDto<ApplicationViewDto>
            {
                statusCode = HttpStatus.OK,
                message = Message.APPLICATION_SENT_SUCCESS,
                data = _mapper.Map<ApplicationViewDto>(newApplication)
            };
            return result;
        }
    }
}

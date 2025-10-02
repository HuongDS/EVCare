using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.BlockedDate;
using DataAccess.Entities;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class BlockedDateService : IBlockedDateService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IBlockedDateRepository _blockedDateRepository;
        private readonly IMapper _mapper;
        public BlockedDateService(IBlockedDateRepository blockedDateRepository,IMapper mapper, IAppointmentRepository appointmentRepository)
        {
            _blockedDateRepository = blockedDateRepository;
            _mapper = mapper;
            _appointmentRepository = appointmentRepository;
        }

        public async Task<int> CreatePost(BlockedDatePostModel model)
        {
            var cnt = await _appointmentRepository.CountAppointment(model.Date);
            if (cnt > 0)
            {
                throw new Exception($"The Date {model.Date} has {cnt} appointments");
            }
            var date = _mapper.Map<CenterUnavailableDays>(model);
            var blockedDate = await _blockedDateRepository.AddAsync(date);
            return blockedDate.Id;

        }

        public async Task<IEnumerable<BlockedDateViewModel>> GetBlockedDateFromToday()
        {
            return await _blockedDateRepository.GetBlockedDateFromToday();
        }
    }
}

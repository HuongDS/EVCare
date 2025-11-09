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
            var blockedDates = await _blockedDateRepository.GetByDate(model.Date);
            if (blockedDates != null) {
                throw new Exception("Date is already blocked.");
            }
            var date = _mapper.Map<CenterUnavailableDays>(model);
            var blockedDate = await _blockedDateRepository.AddAsync(date);
            return blockedDate.Id;
        }

        public async Task DeleteBlockedDate(DateOnly date) {

            var blockedDate = await _blockedDateRepository.GetByDate(date);
            if (blockedDate == null) {
                throw new Exception("Blocked date not found.");
            }
            await _blockedDateRepository.DeleteAsync(blockedDate.Id);
        }

        public async Task<IEnumerable<BlockedDateViewModel>> GetBlockedDateFromToday()
        {
            return await _blockedDateRepository.GetBlockedDateFromToday();
        }

        public async Task UpdateBlockedDate(BlockedDatePostModel model) {
            var blockedDate = await _blockedDateRepository.GetByDate(model.Date);
            if (blockedDate == null) {
                throw new Exception("Blocked date not found.");
            }
            blockedDate.Reason = model.Reason;
            blockedDate.Type = model.UnavailableType;

            await _blockedDateRepository.UpdateAsync(blockedDate);  
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess;
using DataAccess.Dtos.Appointment;
using DataAccess.Dtos.Pagination;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;

        private readonly IMapper _mapper;
        public AppointmentService(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<int> CreateAppointment(AppointmentCreateModel model)
        {
            var appointment = _mapper.Map<Appointment>(model);
            await _appointmentRepository.AddAsync(appointment);
            return appointment.Id;

        }
        public async Task<int> UpdateAppointmentStatus(AppointmentUpdateDto data)
        {
            try
            {
                await _appointmentRepository.UpdateAppointmentStatusAsync(data.appointmentID, data.status);
                return data.appointmentID;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<PageResultDto<AppointmentViewDto>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, DateOnly currentDate, int pageSize, int pageIndex)
        {
            var (appointments, totalItems, totalPages) = await _appointmentRepository.GetAppointmentByEmployeeIDAsync(employeeID, status, currentDate, pageSize, pageIndex);
            return new PageResultDto<AppointmentViewDto>
            {
                items = _mapper.Map<IEnumerable<AppointmentViewDto>>(appointments),
                totalItems = totalItems,
                totalPages = totalPages,
                pageIndex = pageIndex,
                pageSize = pageSize
            };
        }
        public async Task<PageResultDto<AppointmentViewDto>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, int pageSize, int pageIndex)
        {
            var (appointments, totalItems, totalPages) = await _appointmentRepository.GetAppointmentByEmployeeIDAsync(employeeID, status, pageSize, pageIndex);
            return new PageResultDto<AppointmentViewDto>
            {
                items = _mapper.Map<IEnumerable<AppointmentViewDto>>(appointments),
                totalItems = totalItems,
                totalPages = totalPages,
                pageIndex = pageIndex,
                pageSize = pageSize
            };
        }
    }
}

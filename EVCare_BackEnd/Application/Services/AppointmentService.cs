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
        private readonly IServiceCenterRepository _serviceCenterRepository;
        private readonly IMapper _mapper;
        public AppointmentService(IAppointmentRepository appointmentRepository, IMapper mapper, IServiceCenterRepository serviceCenterRepository)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
            _serviceCenterRepository = serviceCenterRepository;
        }

        public async Task<int> CreateAppointment(AppointmentCreateModel model)
        {
            // check số lần đặt của khách hàng
            // check ngày hôm đó
            var appointment = _mapper.Map<Appointment>(model);

            if (await CheckCustomerCreate(appointment))
            {
                throw new Exception("You’ve reached your booking limit.");

            }
            if(await CheckAppointmentsToday())
            {
                throw new Exception("This day is fully booked");
            }
            await  _appointmentRepository.AddAsync(appointment);

            return appointment.Id;

        }


        private async Task<bool> CheckAppointmentsToday()
        {
            int appointments = await _appointmentRepository.CountAppointmnetToday();
            int capacity = await _serviceCenterRepository.GetAppactityOfServiceCenter();
            if (appointments > capacity) {
               return false;
            
            }
            return true;
        }

        private async Task<bool> CheckCustomerCreate(Appointment appointment)
        {
            int appointments = await _appointmentRepository.CountAppointmentsPerDay(appointment.Id);
            int dailyLimit = await _serviceCenterRepository.GetLimitBookingOfServiceCenter();
            if (appointments > dailyLimit)
            {

                return false;
            }
            return true;


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

        public async Task<bool> DeleteAppointment(int appointmentId)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
            if (appointment == null)
            {
                throw new Exception("Appointment not found");
            }
            appointment.Status = DataAccess.Enums.AppointmentStatusEnum.Canceled;
            await _appointmentRepository.UpdateAsync(appointment);
            return true;
        }

        public async Task<AppointmentViewDetailModel> GetAppointmentByiD(int appointmentIdId)
        {
            try
            {
                var result = await _appointmentRepository.GetAppointmentWithDetails(appointmentIdId);
                if (result == null) throw new Exception("Appointment not found");
                return result;

            }
            catch
            {
                throw new Exception("Appointment not found");
            }
        }

        public async Task<IEnumerable<AppointmentViewModel>> GetAppointmentHistoryByCustomerId(int customerId)
        {
            try
            {
                var result = await _appointmentRepository.GetAppointmentsByCustomerId(customerId);
                return result;

            }
            catch (Exception e)
            {

                throw new Exception("Error retrieving appointment history");
            }

        }

        public async Task<IEnumerable<AppointmentViewModel>> GetAppointmentsWithPagination(int? payload, int? pageindex)
        {
            try
            {
                int pageSize = payload ?? 10;
                int pageIndex = pageindex ?? 1;
                return await _appointmentRepository.GetAppointmentsWithPagination(pageSize, pageIndex);

            }
            catch (Exception e)
            {
                throw new Exception("Error retrieving appointments with pagination");
            }
        }

        public async Task<bool> UpdateAppointment(AppointmentUpdateModel model, int employeeId)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(model.AppointmentId);
            if (appointment == null)
            {
                throw new Exception("Appointment not found");
            }
            _mapper.Map(model, appointment);
            appointment.EmployeeId = employeeId;
            await _appointmentRepository.UpdateAsync(appointment);
            return true;

        }
    }
}

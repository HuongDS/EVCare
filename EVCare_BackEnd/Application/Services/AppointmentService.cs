using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess;
using DataAccess.Dtos.Appointment;

using DataAccess.Entities;
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
           await  _appointmentRepository.AddAsync(appointment);
            return appointment.Id;

        }

       

        public async Task<bool> DeleteAppointment(int appointmentId)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
            if(appointment == null)
            {
                throw new Exception("Appointment not found");
            }
            appointment.Status= DataAccess.Enums.AppointmentStatusEnum.Canceled;
            await _appointmentRepository.UpdateAsync(appointment);
            return true;
        }

        public async Task<AppointmentViewDetailModel> GetAppointmentByiD(int appointmentIdId)
        {
            try
            {
                var result = await _appointmentRepository.GetAppointmentWithDetails(appointmentIdId);
                if(result == null) throw new Exception("Appointment not found");
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
            catch (Exception e) {
               
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
            if(appointment == null)
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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Employees;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Technicians;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class EmployeeServices : IEmployeeServices
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IServiceCenterRepository _serviceCenterRepository;
        private readonly ITechnicianRepository _technicianRepository;
        private readonly IMapper _mapper;
        private readonly ITechnicianWorkingSessionRepository _technicianWorkingSessionRepository;

        public EmployeeServices(IEmployeeRepository employeeRepository, IAppointmentRepository appointmentRepository,
            IServiceCenterRepository serviceCenterRepository, ITechnicianRepository technicianRepository,
            IMapper mapper, ITechnicianWorkingSessionRepository technicianWorkingSessionRepository)
        {
            this._employeeRepository = employeeRepository;
            this._appointmentRepository = appointmentRepository;
            this._serviceCenterRepository = serviceCenterRepository;
            this._technicianRepository = technicianRepository;
            this._mapper = mapper;
            this._technicianWorkingSessionRepository = technicianWorkingSessionRepository;
        }
        public async Task<(int, int)> CheckSlotsAsync()
        {
            var totalSlots = await _serviceCenterRepository.GetSlotLimitAsync();
            var usedSlots = await _appointmentRepository.GetCurrentSlotAsync();
            return (usedSlots, totalSlots);
        }
        public async Task AssignOrderToTechnicianAsync(AssignTechnicianDto data)
        {
            var newSession = _mapper.Map<TechnicianWorkingSession>(data);
            await _technicianWorkingSessionRepository.AssignTechnicianToOrder(newSession);
            var appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(data.orderID);
            appointment.Status = AppointmentStatusEnum.InProgress;
            await _appointmentRepository.UpdateAsync(appointment);
        }

        public async Task<int> GetEmployeeIdByAccountId(int accountId)
        {
            var employee = await _employeeRepository.GetEmployeeByAccountId(accountId);
            return employee.Id;
        }

        public async Task<PageResultDto<EmployeeViewModel>> GetAllEmployeesAsync(EmployeeQueryDto query)
        {
            return await _employeeRepository.GetAllEmployeesAsync(query);
        }
    }
}

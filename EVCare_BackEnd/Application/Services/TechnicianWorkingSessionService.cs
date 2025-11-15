using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DomainEvents;
using Application.Interfaces;
using DataAccess.Dtos.Technician;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;
using DataAccess.Repositories;

namespace Application.Services
{
    //alo
    public class TechnicianWorkingSessionService : ITechnicianWorkingSessionService {
        private readonly ITechnicianWorkingSessionRepository _technicianWorkingSessionRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly INotificationServices _notificationServices;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly OnAssignTechnician _onAssignTechnician;
        private readonly IAccountRepository _accountRepository;
        private readonly IAppointmentPartConditionRepository _appointmentPartConditionRepository;
        private readonly IOrderPartRepository _orderPartRepository;

        public TechnicianWorkingSessionService(ITechnicianWorkingSessionRepository technicianWorkingSessionRepository
            , IOrderRepository orderRepository
            , IAppointmentRepository appointmentRepository
            , INotificationServices notificationServices
            , IEmployeeRepository employeeRepository
            , OnAssignTechnician onAssignTechnician
            , IAccountRepository accountRepository,
             IAppointmentPartConditionRepository appointmentPartConditionRepository,
            IOrderPartRepository orderPartRepository
            ) {
            _orderRepository = orderRepository;
            _appointmentRepository = appointmentRepository;
            _technicianWorkingSessionRepository = technicianWorkingSessionRepository;
            _notificationServices = notificationServices;
            _employeeRepository = employeeRepository;
            _onAssignTechnician = onAssignTechnician;
            _accountRepository = accountRepository;
            _appointmentPartConditionRepository = appointmentPartConditionRepository;
            _orderPartRepository = orderPartRepository;
        }

        public async Task AddTechnicianToOrder(AssignTechniciansModel model) {

            foreach (var technicianId in model.TechnicianIds) {
                var employee = await _employeeRepository.GetEmployeeByTechnicianId(technicianId);
                if(employee == null) {
                    throw new Exception($"Employee for technician with id {technicianId} not found.");
                }
                if (employee.Status == DataAccess.Enums.EmployeeStatusEnum.Busy) {
                    throw new Exception($"Technician with id {technicianId} is currently busy.");
                }
                if (employee.Status == DataAccess.Enums.EmployeeStatusEnum.OnLeave) {
                    throw new Exception($"Technician with id {technicianId} is currently on leave.");
                }
                
            }


            var lists = model.TechnicianIds.Select(x => new TechnicianWorkingSession
            {
                OrderId = model.OrderId,
                TechnicianId = x,
                StartTime = DateTime.Now,
                Status = model.Status
            });
            if (model.Status == DataAccess.Enums.TechnicianWorkingSessionEnum.Pending) {
                var appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(model.OrderId);
                appointment.Status = DataAccess.Enums.AppointmentStatusEnum.AddingPart;
                await _appointmentRepository.UpdateAsync(appointment);

            }

            var technicianAccountIds = await _accountRepository.GetAccountIdByTechnicianIds(model.TechnicianIds);
            var technicianAccountIdsString = technicianAccountIds.Select(t => t.ToString());

            await _employeeRepository.MarkBusyForTechnician(model.TechnicianIds);
            await _technicianWorkingSessionRepository.AddRange(lists);
            await _onAssignTechnician.HandleAsync(technicianAccountIdsString);
        }

        public async Task UpdateStatusTechnicinInOrder(List<int> technicianId, int orderId) {
            var appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(orderId);
            if (appointment == null)
            {
                throw new Exception("Appointment not found for the given order.");
            }
            if (appointment.Status == DataAccess.Enums.AppointmentStatusEnum.ReadyForPickup ||
                appointment.Status == DataAccess.Enums.AppointmentStatusEnum.Done ||
                appointment.Status == DataAccess.Enums.AppointmentStatusEnum.Canceled)
            {
                throw new Exception("Cannot update technician from order that is done or ready for pickup or canceled.");
            }
            await _technicianWorkingSessionRepository.UpdateStatusTechnicinInOrder(technicianId, orderId);
            await _employeeRepository.MarkAvaliableTechnician(technicianId);

            
            if (await _technicianWorkingSessionRepository.CheckOrderDone(orderId)) {
                var order = await _orderRepository.GetByIdAsync(orderId);
                order.Status = DataAccess.Enums.OrderStatusEnum.Completed;
                await _orderRepository.UpdateAsync(order);
                appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(orderId);
                appointment.Status = DataAccess.Enums.AppointmentStatusEnum.ReadyForPickup;

                await _appointmentRepository.UpdateAsync(appointment);

                if (await _appointmentRepository.CheckAllReadyForPickup(appointment.VehicleId)) {
                    var ids = await _appointmentRepository.GetAppointmentReadyForPickUpByVehicleId(appointment.VehicleId);
                    foreach (var id in ids) {
                        var data = await _appointmentRepository.GetPaymentPendingPickupEmailModel(id);
                        await _notificationServices.SendPaymentPendingPickupEmailAsync(data);

                    }

                }
            }


        }

        public async Task<TechnicianWorkingSessionViewModel> GetTechnicianWorkingSession(int orderId, int technicianId)
        {
            return await _technicianWorkingSessionRepository.GetTechnicianWorkingSession(orderId, technicianId);
        }

        public async Task UpdateWorkingSession(int technician, TechnicianWorkingSessionUpdateModel model)
        {
            await _technicianWorkingSessionRepository.UpdateStatusWorkingSession(technician, model);


            if (model.Status == DataAccess.Enums.TechnicianWorkingSessionEnum.Confirm)
            {
                if (await _technicianWorkingSessionRepository.CheckOrderConfirm(model.OrderId))
                {
                    var order = await _orderRepository.GetByIdAsync(model.OrderId);
                    order.Status = DataAccess.Enums.OrderStatusEnum.WaitingConfirm;
                    await _orderRepository.UpdateAsync(order);
                    var appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(model.OrderId);
                    appointment.Status = DataAccess.Enums.AppointmentStatusEnum.InProgress;
                    await _appointmentRepository.UpdateAsync(appointment);
                }

            }
            if (model.Status == DataAccess.Enums.TechnicianWorkingSessionEnum.Completed)
            {
                await _orderPartRepository.UpdateCompletedStatusByOrderIdAndTechnicianId(model.OrderId, technician);
                var partIds = await _orderPartRepository.GetPartIdsInAppointmentByTechId(model.OrderId,technician);
                foreach (var partId in partIds)
                {
                    var appointment = await _appointmentRepository.GetByOrderIdAsync(model.OrderId);
                    var appoimentPartConditions = await _appointmentPartConditionRepository
                        .GetAppointmentPartConditionsByTechIdAndPartIdAndAppointmentIdAsync(appointment.Id, partId, technician);
                    if (appoimentPartConditions != null) {
                        
                        appoimentPartConditions.Level = DamageLevelEnum.Done;
                        await _appointmentPartConditionRepository.UpdateAsync(appoimentPartConditions);
                        
                    }
                }

                if (await _technicianWorkingSessionRepository.CheckOrderDone(model.OrderId))
                {
                    var order = await _orderRepository.GetByIdAsync(model.OrderId);
                    order.Status = DataAccess.Enums.OrderStatusEnum.Completed;
                    await _orderRepository.UpdateAsync(order);
                    var appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(model.OrderId);
                    appointment.Status = DataAccess.Enums.AppointmentStatusEnum.ReadyForPickup;

                    await _appointmentRepository.UpdateAsync(appointment);

                    if (await _appointmentRepository.CheckAllReadyForPickup(appointment.VehicleId))
                    {
                        var ids = await _appointmentRepository.GetAppointmentReadyForPickUpByVehicleId(appointment.VehicleId);
                        foreach (var id in ids)
                        {
                            var data = await _appointmentRepository.GetPaymentPendingPickupEmailModel(id);
                            await _notificationServices.SendPaymentPendingPickupEmailAsync(data);

                        }

                    }
                }
            }


        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Technician;
using DataAccess.Entities;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class TechnicianWorkingSessionService : ITechnicianWorkingSessionService
    {
        private readonly ITechnicianWorkingSessionRepository _technicianWorkingSessionRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly INotificationServices _notificationServices;   
        public TechnicianWorkingSessionService(ITechnicianWorkingSessionRepository technicianWorkingSessionRepository
            ,IOrderRepository orderRepository
            ,IAppointmentRepository appointmentRepository
            ,INotificationServices notificationServices
            )
        {
            _orderRepository = orderRepository;
            _appointmentRepository = appointmentRepository;
            _technicianWorkingSessionRepository = technicianWorkingSessionRepository;
            _notificationServices = notificationServices;
        }

        public async Task AddTechnicianToOrder(AssignTechniciansModel model)
        {

            var lists = model.TechnicianIds.Select(x => new TechnicianWorkingSession
            {
                OrderId = model.OrderId,
                TechnicianId = x,
                StartTime = DateTime.Now,
                Status = DataAccess.Enums.TechnicianWorkingSessionEnum.Pending
            });
            await _technicianWorkingSessionRepository.AddRange(lists);
        }

        public async Task<TechnicianWorkingSessionViewModel> GetTechnicianWorkingSession(int orderId, int technicianId)
        {
            return await _technicianWorkingSessionRepository.GetTechnicianWorkingSession(orderId, technicianId);
        }

        public async Task UpdateWorkingSession(int technician,TechnicianWorkingSessionUpdateModel model)
        {
            await _technicianWorkingSessionRepository.UpdateStatusWorkingSession(technician, model);
          

            if(model.Status == DataAccess.Enums.TechnicianWorkingSessionEnum.Confirm)
            {
               if(await _technicianWorkingSessionRepository.CheckOrderConfirm(model.OrderId))
                {
                    var order = await _orderRepository.GetByIdAsync(model.OrderId);
                    order.Status = DataAccess.Enums.OrderStatusEnum.WaitingConfirm;
                    await _orderRepository.UpdateAsync(order);
                    var appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(model.OrderId);
                    appointment.Status = DataAccess.Enums.AppointmentStatusEnum.InProgress;
                    await _appointmentRepository.UpdateAsync(appointment);
                }

            }
            if(model.Status == DataAccess.Enums.TechnicianWorkingSessionEnum.Completed)
            {
                if (await _technicianWorkingSessionRepository.CheckOrderDone(model.OrderId))
                {
                    var order = await _orderRepository.GetByIdAsync(model.OrderId);
                    order.Status = DataAccess.Enums.OrderStatusEnum.Completed;
                    await _orderRepository.UpdateAsync(order);
                    var appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(model.OrderId);
                    appointment.Status = DataAccess.Enums.AppointmentStatusEnum.ReadyForPickup;
                    appointment.Alerts.Add(new Alert
                    {
                        Message = "Your Appointment has done",
                        Is_Read = false,
                    });
                    await _appointmentRepository.UpdateAsync(appointment);

                    if(await _appointmentRepository.CheckAllReadyForPickup(appointment.VehicleId))
                    {
                        var ids = await _appointmentRepository.GetAppointmentReadyForPickUpByVehicleId(appointment.VehicleId);
                        foreach(var id in ids)
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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Technician;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class TechnicianWorkingSessionService : ITechnicianWorkingSessionService
    {
        private readonly ITechnicianWorkingSessionRepository _technicianWorkingSessionRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IUnitOfWork _unitOfWork;   
        public TechnicianWorkingSessionService(ITechnicianWorkingSessionRepository technicianWorkingSessionRepository
            ,IOrderRepository orderRepository
            ,IAppointmentRepository appointmentRepository
            
            )
        {
            _orderRepository = orderRepository;
            _appointmentRepository = appointmentRepository;
            _technicianWorkingSessionRepository = technicianWorkingSessionRepository;
        }

        public async Task UpdateWorkingSession(int technician,TechnicianWorkingSessionUpdateModel model)
        {
            await _technicianWorkingSessionRepository.UpdateStatusWorkingSession(technician, model);
            if (model.Status != DataAccess.Enums.TechnicianWorkingSessionEnum.Completed) return;
            if(await _technicianWorkingSessionRepository.CheckOrderDone(model.OrderId))
            {
                var order = await _orderRepository.GetByIdAsync(model.OrderId);
                order.Status = DataAccess.Enums.OrderStatusEnum.Completed;
                await _orderRepository.UpdateAsync(order);
                var appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(model.OrderId);
                appointment.Status = DataAccess.Enums.AppointmentStatusEnum.ReadyForPickup;
                appointment.Alerts.Add(new DataAccess.Entities.Alert
                {
                    AppointmentId = appointment.Id,
                    Message = $"Your appointment have ready to pick up"
                });
                await _appointmentRepository.UpdateAsync(appointment);
            }

        }
    }
}

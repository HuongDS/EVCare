using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class ReminderService : IReminderService
    {
        private readonly IVehicleRepository _vehicleRepository;
        private readonly INotificationServices _notificationServices;
        public ReminderService(IVehicleRepository vehicleRepository, INotificationServices notificationServices)
        {
            _vehicleRepository = vehicleRepository;
            _notificationServices = notificationServices;
        }
        public async Task SendEmailRemindersAsync()
        {
            var vehicles = await _vehicleRepository.GetVehicleReminderTodayAsync();
            foreach(var vehicle in vehicles)
            {
                await _notificationServices.SendEmailToRemider(vehicle);
                try
                {
                    var entity = await _vehicleRepository.GetByIdAsync(vehicle.Id);
                    entity.NextServiceDate = DateTime.Now.AddMonths(entity.ReminderIntervalMonths);
                    await _vehicleRepository.UpdateAsync(entity);
                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
                
            }
           
        }
    }
}

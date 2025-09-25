using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.Alerts;
using DataAccess.Entities;
using DataAccess.Interfaces;

namespace Application.Services
{

    public class AlertServices : IAlertServices
    {
        private readonly IAlertRepository _alertRepository;

        public AlertServices(IAlertRepository alertRepository)
        {
            this._alertRepository = alertRepository;
        }
        public async Task AddConfirmAlertAsync(AlertCreateDto data)
        {
            var alert = new Alert
            {
                AppointmentId = data.appointmentId,
                Message = data.message,
                Create_At = DateTime.UtcNow,
                Is_Read = false

            };
            await _alertRepository.AddAsync(alert);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class AppointmentExpiryJob : IAppointmentExpiryJob
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public AppointmentExpiryJob(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task CancelAppointment()
        {
            await _appointmentRepository.CancelAppointment();
        }
    }
}

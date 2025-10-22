using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Interfaces;

namespace Application.Services {
    public class AppointmentPartConditionService : IAppointmentPartConditionService {
        private readonly IAppointmentPartConditionRepository _appointmentPartConditionRepository;
        public AppointmentPartConditionService(IAppointmentPartConditionRepository appointmentPartConditionRepository) {
            _appointmentPartConditionRepository = appointmentPartConditionRepository;
        }
    }
}

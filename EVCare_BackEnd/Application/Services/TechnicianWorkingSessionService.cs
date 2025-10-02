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
        public TechnicianWorkingSessionService(ITechnicianWorkingSessionRepository technicianWorkingSessionRepository)
        {
            _technicianWorkingSessionRepository = technicianWorkingSessionRepository;
        }

        public async Task UpdateWorkingSession(int technician,TechnicianWorkingSessionUpdateModel model)
        {
             await _technicianWorkingSessionRepository.UpdateStatusWorkingSession(technician, model);
        }
    }
}

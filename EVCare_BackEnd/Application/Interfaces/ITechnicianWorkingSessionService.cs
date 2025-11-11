using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Technician;

namespace Application.Interfaces
{
    public interface ITechnicianWorkingSessionService
    {
        Task UpdateWorkingSession(int technicianId,TechnicianWorkingSessionUpdateModel model);
        Task<TechnicianWorkingSessionViewModel> GetTechnicianWorkingSession(int orderId, int technicianId);
        Task AddTechnicianToOrder(AssignTechniciansModel model);
        Task UpdateStatusTechnicinInOrder(List<int> technicianId, int orderId);
    }
}

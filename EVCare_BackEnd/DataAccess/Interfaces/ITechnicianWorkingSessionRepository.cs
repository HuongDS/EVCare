using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Technician;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface ITechnicianWorkingSessionRepository
    {
        Task AssignTechnicianToOrder(TechnicianWorkingSession data);
        Task UpdateStatusWorkingSession(int technician, TechnicianWorkingSessionUpdateModel model);
        Task<bool> CheckOrderDone(int orderId);
        Task<TechnicianWorkingSessionViewModel> GetTechnicianWorkingSession(int orderId, int technicianId);
        Task AddRange(IEnumerable<TechnicianWorkingSession> lists);
        Task MakeProcessing(int id);
        Task<bool> CheckOrderConfirm(int orderId);
        Task MakeCancel(int id);
        Task MakeAvaliable(int id);
        Task UpdateStatusTechnicinInOrder(List<int> technicianId, int orderId);
        Task AddTechnician(TechnicianWorkingSession technicianWorkingSession);
    }
}

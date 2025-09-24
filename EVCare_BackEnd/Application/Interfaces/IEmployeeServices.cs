using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Technicians;

namespace Application.Interfaces
{
    public interface IEmployeeServices
    {
        Task AssignOrderToTechnicianAsync(AssignTechnicianDto data);
        Task<(int, int)> CheckSlotsAsync();
    }
}

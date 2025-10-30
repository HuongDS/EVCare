using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.MongoDb_Message;

namespace Application.Interfaces
{
    public interface IStaffRoutingService
    {
        Task<string?> FindAvailableAsync(string customerAccountId);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Application.DomainEvents
{
    public class OnAssignTechnician
    {
        private readonly IHubContext<TechnicianHub> _techHub;

        public OnAssignTechnician(IHubContext<TechnicianHub> techHub)
        {
            _techHub = techHub;
        }

        public virtual async Task HandleAsync(IEnumerable<string> accountTechnicianIds)
        {
            await _techHub.Clients.Users(accountTechnicianIds).SendAsync("TechnicianNewJob", new
            {
                Type = "NewJob",
                Data = "You was assigned new job."
            });
        }
    }
}

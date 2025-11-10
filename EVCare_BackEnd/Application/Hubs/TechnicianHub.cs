using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GenerativeAI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Application.Hubs
{
    [Authorize(Roles = "Technician")]
    public class TechnicianHub : Hub
    {
    }
}

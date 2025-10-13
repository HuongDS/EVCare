using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
    [Authorize(Roles = "Admin")]
    public class AdminDashboardHub : Hub
    {
    }
}

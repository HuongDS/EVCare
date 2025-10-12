using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
    [AllowAnonymous]
    public class AdminDashboardHub : Hub
    {
    }
}

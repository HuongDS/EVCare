namespace Application.DomainEvents
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using API.Hubs;
    using Application.Interfaces;
    using DataAccess.Dtos.Others;
    using Microsoft.AspNetCore.SignalR;

    public class OnInvoiceCompleteHandler
    {
        private readonly IHubContext<AdminDashboardHub> _hub;

        private readonly IAdminDashboardServices _adminDashboardServices;

        public OnInvoiceCompleteHandler(IHubContext<AdminDashboardHub> hub,
             IAdminDashboardServices adminDashboardServices)
        {
            _hub = hub;
            _adminDashboardServices = adminDashboardServices;
        }

        public async Task HandleAsync()
        {
            var today = DateTime.Today;
            var performance = await _adminDashboardServices.GetPerformanceAsync(today, today);
            await _hub.Clients.All.SendAsync("AdminDashboardUpdate", new
            {
                Type = "InvoiceComplete",
                Data = performance
            });
        }
    }
}

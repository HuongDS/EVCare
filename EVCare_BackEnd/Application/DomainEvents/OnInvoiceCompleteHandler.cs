namespace Application.DomainEvents
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using API.Hubs;
    using Application.Hubs;
    using Application.Interfaces;
    using DataAccess.Dtos.MongoDb_Message;
    using DataAccess.Dtos.Others;
    using Microsoft.AspNetCore.SignalR;

    public class OnInvoiceCompleteHandler
    {
        private readonly IHubContext<AdminDashboardHub> _adminHub;

        private readonly IAdminDashboardServices _adminDashboardServices;
        private readonly IHubContext<StaffDashboardHub> _staffHub;

        public OnInvoiceCompleteHandler(IHubContext<AdminDashboardHub> hub,
             IAdminDashboardServices adminDashboardServices,
             IHubContext<StaffDashboardHub> staffHub)
        {
            _adminHub = hub;
            _adminDashboardServices = adminDashboardServices;
            _staffHub = staffHub;
        }

        public async Task HandleAsync()
        {
            var today = DateTime.Today;
            var performance = await _adminDashboardServices.GetPerformanceAsync(today, today);
            await _adminHub.Clients.All.SendAsync("AdminDashboardUpdate", new
            {
                Type = "InvoiceComplete",
                Data = performance
            });
            await _staffHub.Clients.All.SendAsync("StaffDashboardUpdate", new
            {
                Type = "InvoiceComplete",
                Data = "Successfully completed an invoice."
            });
        }
    }
}

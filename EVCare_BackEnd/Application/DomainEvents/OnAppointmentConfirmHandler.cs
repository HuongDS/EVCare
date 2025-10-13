using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Hubs;
using Application.Interfaces;
using DataAccess.Dtos.Others;
using Microsoft.AspNetCore.SignalR;

namespace Application.DomainEvents
{
    public class OnAppointmentConfirmHandler
    {
        private readonly IHubContext<AdminDashboardHub> _hub;

        private readonly IAdminDashboardServices _adminDashboardServices;

        public OnAppointmentConfirmHandler(IHubContext<AdminDashboardHub> hub,
             IAdminDashboardServices adminDashboardServices)
        {
            _hub = hub;
            _adminDashboardServices = adminDashboardServices;
        }

        public async Task HandleAsync()
        {
            var today = DateTime.Today;
            var performance = await _adminDashboardServices.GetPerformanceAsync(today, today);
            var update = new DashboardUpdateDto(
                   OrdersToday: performance.ThisMonth.Count(),
                     RevenueToday: performance.ThisMonth.Sum(),
                        LastUpdate: DateTime.Now
                );
            await _hub.Clients.All.SendAsync("AdminDashboardUpdate", update);
        }
    }
}

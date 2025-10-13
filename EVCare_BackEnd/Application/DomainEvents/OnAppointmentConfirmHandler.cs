using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Hubs;
using Application.Interfaces;
using DataAccess.Dtos.Others;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;

namespace Application.DomainEvents
{
    public class OnAppointmentConfirmHandler
    {
        private readonly IHubContext<AdminDashboardHub> _hub;

        private readonly IAdminDashboardServices _adminDashboardServices;
        private readonly IDatabase _redis;

        public OnAppointmentConfirmHandler(IHubContext<AdminDashboardHub> hub,
             IAdminDashboardServices adminDashboardServices,
             IConnectionMultiplexer redis)
        {
            _hub = hub;
            _adminDashboardServices = adminDashboardServices;
            _redis = redis.GetDatabase();
        }

        public async Task HandleAsync()
        {
            var today = DateTime.Today;
            await _redis.KeyDeleteAsync("dashboard:summary");
            var performance = await _adminDashboardServices.GetSummaryCachedAsync(today, today);
            await _hub.Clients.All.SendAsync("AdminDashboardUpdate", performance);
        }
    }
}

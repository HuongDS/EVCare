using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Hubs;
using Application.Interfaces;
using Application.Services;
using DataAccess.Dtos.OrderParts;
using DataAccess.Enums;
using Microsoft.AspNetCore.SignalR;

namespace Application.DomainEvents
{
    public class OnStatusOrderChange
    {
        private readonly IHubContext<StaffDashboardHub> _staffHub;
        private readonly IHubContext<TechnicianHub> _techHub;
        private readonly IAccountService _accountService;

        public OnStatusOrderChange(IHubContext<StaffDashboardHub> staffHub, IHubContext<TechnicianHub> techHub,
            IAccountService accountService)
        {
            _staffHub = staffHub;
            _techHub = techHub;
            _accountService = accountService;
        }
        public virtual async Task HandleAsync<T>(OrderStatusChangeEventEnum type, IEnumerable<int>? technicianId, T? data)
        {
            if (type == OrderStatusChangeEventEnum.OrderConfirmed)
            {
                var technicianAccountId = await _accountService.GetAccountIdByTechnicianIds(technicianId);
                await _staffHub.Clients.All.SendAsync("TechnicianConfirmOrder", new
                {
                    Type = "OrderConfirmed",
                    Data = data
                });
                if (technicianAccountId != null && technicianAccountId.Any())
                {
                    await _techHub.Clients.User(technicianAccountId.First().ToString()).SendAsync("TechnicianConfirmOrder", new
                    {
                        Type = "OrderConfirmed",
                        Data = data
                    });
                }
            }
            else if (type == OrderStatusChangeEventEnum.OrderStatusUpdate)
            {
                await _staffHub.Clients.All.SendAsync("StaffUpdateOrderStatus", new
                {
                    Type = "UpdateOrderStatus",
                    Data = data
                });
            }
            else if (type == OrderStatusChangeEventEnum.StaffConfirmed)
            {
                await _staffHub.Clients.All.SendAsync("StaffUpdateOrderStatus", new
                {
                    Type = "UpdateOrderStatus",
                    Data = "Staff confirm order."
                });
            }
            else if (type == OrderStatusChangeEventEnum.TechnicianDoneTask)
            {
                await _staffHub.Clients.All.SendAsync("TechnicianDoneTask", new
                {
                    Type = "UpdateOrderStatus",
                    Data = "Technician Done Task."
                });
            }
        }
    }
}

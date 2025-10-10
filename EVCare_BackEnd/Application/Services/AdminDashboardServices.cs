using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess;
using DataAccess.Dtos.Others;
using DataAccess.Enums;
using DataAccess.Interfaces;
using DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class AdminDashboardServices : IAdminDashboardServices
    {
        private readonly EVCareDbContext _dbContext;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IInvoiceRepository _invoiceRepository;

        public AdminDashboardServices(EVCareDbContext dbContext, IAppointmentRepository appointmentRepository, IInvoiceRepository invoiceRepository)
        {
            _dbContext = dbContext;
            _appointmentRepository = appointmentRepository;
            _invoiceRepository = invoiceRepository;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync(DateTime? from = null, DateTime? to = null)
        {
            if (from == null)
            {
                from = DateTime.Now;
            }
            if (to == null)
            {
                to = DateTime.Now;
            }
            var customer = await _appointmentRepository.CountCustomersInMonth(from.Value.Year, to.Value.Month);
            var appointments = await _appointmentRepository.CountAppointmentsInMonth(from.Value.Year, to.Value.Month);
            var cancelAppointments = await _appointmentRepository.CountAppointmentsInMonthWithStatus(from.Value.Year, to.Value.Month, DataAccess.Enums.AppointmentStatusEnum.Canceled);
            var revenue = await _invoiceRepository.GetRevenue(from.Value.Year, to.Value.Month);
            return new DashboardSummaryDto(customer, appointments, cancelAppointments, revenue);
        }

        public async Task<PerformanceDto> GetPerformanceAsync(DateTime from, DateTime to)
        {
            // Example: aggregate revenue per day
            var rangeDays = Enumerable.Range(0, (to.Date - from.Date).Days + 1)
            .Select(d => from.Date.AddDays(d))
            .ToList();


            var revThis = await _dbContext.Invoices
            .Where(i => i.Status == PaymentStatusEnum.Completed && i.Updated_At >= from && i.Updated_At <= to)
            .GroupBy(i => i.Updated_At.Date)
            .Select(g => new { Date = g.Key, Sum = g.Sum(x => x.Total_Price) })
            .ToListAsync();


            // Last month range for comparison
            var lastFrom = from.AddMonths(-1); var lastTo = to.AddMonths(-1);
            var revLast = await _dbContext.Invoices
            .Where(i => i.Status == PaymentStatusEnum.Completed && i.Updated_At >= lastFrom && i.Updated_At <= lastTo)
            .GroupBy(i => i.Updated_At!.Date)
            .Select(g => new { Date = g.Key, Sum = g.Sum(x => x.Total_Price) })
            .ToListAsync();


            var labels = rangeDays.Select(d => d.ToString("dd")).ToList();
            var thisSeries = rangeDays.Select(d => (decimal)(revThis.FirstOrDefault(x => x.Date == d)?.Sum ?? 0)).ToList();
            var lastSeries = rangeDays.Select(d => (decimal)(revLast.FirstOrDefault(x => x.Date == d.AddMonths(-1))?.Sum ?? 0)).ToList();


            return new PerformanceDto(labels, thisSeries, lastSeries);
        }
    }
}

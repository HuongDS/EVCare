using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.Pagination;
using DataAccess.Entities;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly EVCareDbContext _dbContext;
        public InvoiceRepository(EVCareDbContext eVCareDbContext)
        {
            _dbContext = eVCareDbContext;
        }

        public async Task<int> AddAsync(Invoice entity)
        {
            await _dbContext.Invoices.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<int> DeleteAsync(int id)
        {
            var invoice = _dbContext.Invoices.FindAsync(id);
            _dbContext.Remove(invoice);
            await _dbContext.SaveChangesAsync();
            return 1;


        }

        public async Task<Invoice?> GetInvoiceById(int orderId)
        {
            try
            {
                var invoice = await _dbContext.Invoices.FirstOrDefaultAsync(i => i.OrderId == orderId);
                return invoice;

            }
            catch (Exception ex)
            {
                Console.WriteLine($"{ex.Message}");
                return null;
            }

        }

        public async Task<int> UpdateAsync(Invoice entity)
        {
            _dbContext.Update(entity);
            await _dbContext.SaveChangesAsync();
            return 1;
        }

        public async Task<IEnumerable<InvoiceViewModel>?> GetInvoicesByCustomerId(int customerId)
        {
            var invoices = await _dbContext.Invoices.Include(o => o.Order)
                .ThenInclude(a => a.Appointment)
                .Where(c => c.CustomerId == customerId)
                .Select(i => new InvoiceViewModel
                {
                    id = i.Id,
                    appointmentDate = i.Order.Appointment.Appointment_Date,
                    totalPrice = i.Total_Price,
                    paymentMethod = i.Payment_Method,
                    paymentDate = i.Updated_At,
                    status = i.Status
                }).ToListAsync();
            return invoices;
        }
        public async Task<decimal> GetRevenue(int year, int month)
        {
            var revenue = await _dbContext.Invoices
                .Where(i => i.Updated_At.Year == year && i.Updated_At.Month == month && i.Status == Enums.PaymentStatusEnum.Completed)
                .SumAsync(i => i.Total_Price);
            return revenue;
        }

        public async Task<PageResultDto<InvoiceViewModel>> GetRecentInVoices(InvoiceQueryDto model)
        {
            var invoices = _dbContext.Invoices
                .Include(o => o.Order)
                .ThenInclude(a => a.Appointment)
                .OrderByDescending(i => i.Updated_At)
                .Take(model.pageSize)
                .Select(i => new InvoiceViewModel
                {
                    id = i.Id,
                    appointmentDate = i.Order.Appointment.Appointment_Date,
                    totalPrice = i.Total_Price,
                    paymentMethod = i.Payment_Method,
                    paymentDate = i.Updated_At,
                    status = i.Status
                }).AsQueryable();
            return await PaginationHelper.PaginationAsync<InvoiceViewModel>(invoices, model.pageSize, model.pageIndex);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
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
            catch(Exception ex)
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
    }
}

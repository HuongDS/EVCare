using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IInvoiceRepository
    {
        public Task<Invoice?> GetInvoiceById(int orderId);
        public Task<int> AddAsync(Invoice entity);
        public Task<int> DeleteAsync(int id);
        public Task<int> UpdateAsync(Invoice entity);
    }
}

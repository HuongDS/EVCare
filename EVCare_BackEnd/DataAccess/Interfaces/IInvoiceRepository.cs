using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Invoice;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IInvoiceRepository
    {
        public Task<Invoice?> GetInvoiceById(int orderId);
        public Task<int> AddAsync(Invoice entity);
        public Task<int> DeleteAsync(int id);
        public Task<int> UpdateAsync(Invoice entity);
        Task<IEnumerable<InvoiceViewModel>?> GetInvoicesByCustomerId(int customerId);
        Task<Invoice> GetInvoiceByOrderCode(long orderCode);
        Task<Invoice> GetInvoiceByOrderId(int orderId);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.Pagination;
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
        Task<decimal> GetRevenue(int year, int month);
        Task<PageResultDto<InvoiceViewModel>> GetRecentInVoices(InvoiceQueryDto model);
        Task<Invoice> GetInvoiceByOrderCode(long orderCode);
        Task<Invoice> GetInvoiceByOrderId(int orderId);
        Task<InvoiceViewModel> GetInvoiceViewModelByOrderId(int orderId);
        Task<InvoicePrintDataModel> GetInvoicePrintData(int orderId);
    }
}

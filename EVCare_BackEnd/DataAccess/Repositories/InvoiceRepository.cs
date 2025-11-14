using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Service;
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
                .Select(i => new InvoiceViewModel
                {
                    id = i.Id,
                    appointmentDate = i.Order.Appointment.Appointment_Date,
                    totalPrice = i.Total_Price,
                    paymentMethod = i.Payment_Method,
                    paymentDate = i.Updated_At,
                    status = i.Status
                })
                .AsQueryable();
            return await PaginationHelper.PaginationAsync<InvoiceViewModel>(invoices, model.pageSize, model.pageIndex);
        }

        public async Task<Invoice> GetInvoiceByOrderCode(long orderCode)
        {
            return await _dbContext.Invoices.FirstAsync(i => i.OrderCode == orderCode);
        }

        public async Task<Invoice> GetInvoiceByOrderId(int orderId)
        {
            return await _dbContext.Invoices
                .Include(x => x.Order).ThenInclude(Order => Order.Appointment)
                .FirstOrDefaultAsync(i => i.OrderId == orderId);
                
        }

        public async Task<InvoiceViewModel> GetInvoiceViewModelByOrderId(int orderId)
        {
            return await _dbContext.Invoices.AsNoTracking()
                .Where(x=>x.OrderId == orderId)
                 .Select(x => new InvoiceViewModel
                 {
                     appointmentDate = x.Order.Appointment.Appointment_Date,
                     id = x.Id,
                     paymentDate = x.Create_At,
                     paymentMethod = x.Payment_Method,
                     status = x.Status,
                     totalPrice = x.Total_Price
                 }).FirstOrDefaultAsync();
        }

        public Task<InvoicePrintDataModel> GetInvoicePrintData(int orderId)
        {
            return _dbContext.Invoices
                .AsNoTracking()
                .Where(i => i.OrderId == orderId)
                .Select(i => new InvoicePrintDataModel
                {
                    Id = i.Id,
                    CustomerName = i.Customer.Account.First_Name + " " + i.Customer.Account.Last_Name,
                    VehicleLicensePlate = i.Order.Appointment.Vehicle.LicensePlate,
                    AppointmentDate = i.Order.Appointment.Appointment_Date,
                    TotalPrice = i.Total_Price,
                    PaymentMethod = i.Payment_Method.ToString(),
                    PaymentDate = i.Updated_At,
                    ServiceItems = i.Order.Appointment.AppointmentServices
                        .Select(os => new ServiceViewFormModel
                        {
                            Id = os.Service.Id,
                            Name = os.Service.Name
                        }).ToList(),
                    PartItems = i.Order.OrderParts
                        .Select(op => new OrderPartViewInvoiceModel
                        {
                            PartName = op.Part.Name,
                            Quantity = op.Quantity,
                            ReplacePrice = op.ReplacementPrice,
                            UnitPrice = op.Price,
                        }).ToList()
                }).FirstOrDefaultAsync();
        }

        public async Task<InvoiceDetailViewModel> GetInvoiceDetailByOrderIdAsync(int orderId) {
            var partLists = await _dbContext.OrderParts
                 .AsNoTracking()
                 .Where(x => x.OrderId == orderId)
                 .Include(x => x.Part)
                 .GroupBy(x => new { x.Part.Name, x.ReplacementPrice, x.Price })
                 .Select(x => new OrderPartViewInvoiceModel
                 {
                     PartName = x.Key.Name,
                     Quantity = x.Sum(x=>x.Quantity),
                     ReplacePrice = x.Key.ReplacementPrice,
                     UnitPrice = x.Key.Price

                 }).ToListAsync();
            var subTotal = partLists.Sum(x => x.Quantity * (x.UnitPrice + x.ReplacePrice));
            var tax  = await _dbContext.Invoices
                .AsNoTracking()
                .Where(x => x.OrderId == orderId)
                .Select(x => x.Vat)
                .FirstOrDefaultAsync();
            var total = subTotal * (1 + tax / 100m);

            var query = await _dbContext.Invoices.AsNoTracking()
                .Where(x => x.OrderId == orderId)
                .Select(x => new InvoiceDetailViewModel
                {
                    Id = x.Id,
                    PartItems = partLists,
                    PaymentDate = x.Updated_At,
                    PaymentStatus = x.Status,
                    SubTotal = subTotal,
                    Vat = x.Vat,
                    Total = total,
                    PaymentMethod = x.Payment_Method

                }).FirstOrDefaultAsync();

            return query;
                
        }
    }
}

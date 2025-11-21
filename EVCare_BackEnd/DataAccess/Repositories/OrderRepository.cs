using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Orders;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<int> GetCustomerIdByOrderId(int orderId)
        {
            return await _dbContext.Orders.Where(o => o.Id == orderId)
                .Include(o => o.Appointment)
                .Select(o => o.Appointment.CustomerId)
                .FirstOrDefaultAsync();
        }
        public async Task<int> GetAppointmentIdByOrderId(int orderId)
        {
            var entity = await _dbContext.Orders.AsNoTracking().FirstOrDefaultAsync(o => o.Id == orderId);
            return entity.AppointmentId;
        }

        public async Task<OrderViewModel> GetOrderDetailAsync(int orderId)
        {
            
            var query = await _dbSet.AsNoTracking().Where(x => x.Id == orderId)
                
                .Include(x=>x.OrderParts)
                  .ThenInclude(x=>x.Technician)
                   .ThenInclude(x=>x.Employee)
                    .ThenInclude(x=>x.Account)
                  .Include(x=>x.Appointment).ThenInclude(x=>x.AppointmentPartConditions)
                .Select(x => new OrderViewModel
                {
                    Id = x.Id,
                    Parts = x.OrderParts.
                    Select(a => new Dtos.Part.PartTechnicianViewModel
                    {
                        Id = a.PartId,
                        ImageUrl = a.Part.Image,
                        Name = a.Part.Name,
                        Price = a.Price,
                        Quantity = a.Quantity,
                        TechnicianId = a.TechnicianId,
                        TechnicianName = a.Technician.Employee.Account.First_Name+" " +a.Technician.Employee.Account.Last_Name,
                        ReplacementPrice = a.Part.ReplacementPrice,
                        Stock = a.Part.Stock,
                        PartStatus = x.Appointment.AppointmentPartConditions.Where(apc=>apc.PartId == a.PartId).Select(b=>b.Level).FirstOrDefault()
                        
                    }),
                    Vat = x.Vat,
                    Price = x.OrderParts.Sum(x => (x.Price + x.ReplacementPrice) * x.Quantity) * (1 + x.Vat / 100m),
                    PercentInprogress = x.OrderParts.Count() == 0 ? 0 :
                        (decimal)(x.OrderParts.Where(op => op.IsReplaced).Count() * 100 / x.OrderParts.Count()),

                }).FirstOrDefaultAsync();

            return query;

        }

        public async Task<Order> GetOrderPartsByOrderId(int orderId)
        {
            return await _dbSet.AsNoTracking().Include(x => x.OrderParts).FirstOrDefaultAsync(x => x.Id == orderId);

        }

        public async Task RemoveOrderPartsAsync(int orderId)
        {
            await _dbContext.OrderParts.Where(op => op.OrderId == orderId).ExecuteDeleteAsync();

        }

        public async Task AddOrderPartAsync(OrderPart orderPart)
        {
            await _dbContext.OrderParts.AddAsync(orderPart);
        }

       
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Technician;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class TechnicianWorkingSessionRepository : ITechnicianWorkingSessionRepository
    {
        private readonly EVCareDbContext _dbContext;

        public TechnicianWorkingSessionRepository(EVCareDbContext dbContext)
        {
            this._dbContext = dbContext;
        }
        public async Task AssignTechnicianToOrder(TechnicianWorkingSession data)
        {
            await _dbContext.TechnicianWorkingSessions.AddAsync(data);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateStatusWorkingSession(int technician, TechnicianWorkingSessionUpdateModel model)
        {
            var data = await _dbContext.TechnicianWorkingSessions.Where(x=>x.TechnicianId == technician && x.OrderId == model.OrderId).FirstOrDefaultAsync();
            if (data == null)
            {
                throw new Exception("Source not found");
            }
            data.Status = model.Status;
            if (model.Status == Enums.TechnicianWorkingSessionEnum.Completed) {

                data.EndTime = DateTime.Now;
                var anyComplete = await _dbContext.TechnicianWorkingSessions
                    .AnyAsync(x => x.TechnicianId != technician && x.OrderId == model.OrderId && x.Status != Enums.TechnicianWorkingSessionEnum.Completed);
                if (!anyComplete) { 
                     var order = await _dbContext.Orders.FindAsync(model.OrderId);
                    order.Status = Enums.OrderStatusEnum.Completed;
                    order.Updated_At = DateTime.Now;
                }
            }
            await _dbContext.SaveChangesAsync();


        }
    }
}

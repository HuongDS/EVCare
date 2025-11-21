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

        public async Task AddRange(IEnumerable<TechnicianWorkingSession> lists)
        {
             await _dbContext.AddRangeAsync(lists);
             await _dbContext.SaveChangesAsync();
        }

        public async Task AssignTechnicianToOrder(TechnicianWorkingSession data)
        {
            await _dbContext.TechnicianWorkingSessions.AddAsync(data);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> CheckOrderConfirm(int orderId)
        {
            var anyConfirm = await _dbContext.TechnicianWorkingSessions
                    .AnyAsync(x => x.OrderId == orderId && x.Status != Enums.TechnicianWorkingSessionEnum.Confirm);
            return !anyConfirm;
        }

        public async Task<bool> CheckOrderDone(int orderId)
        {
            var anyComplete = await _dbContext.TechnicianWorkingSessions
                   .AnyAsync(x =>  x.OrderId == orderId && x.Status != Enums.TechnicianWorkingSessionEnum.Completed);
            return !anyComplete;
        }

        public async Task UpdateStatusTechnicinInOrder(List<int> technicianId, int orderId) {
            await _dbContext.TechnicianWorkingSessions
                .Where(x => technicianId.Contains(x.TechnicianId) && x.OrderId == orderId)
                .ExecuteUpdateAsync(s=>s.SetProperty(x=>x.Status, Enums.TechnicianWorkingSessionEnum.Completed)
                 .SetProperty(x=>x.EndTime, DateTime.Now)
                );

        }

        public async Task<TechnicianWorkingSessionViewModel> GetTechnicianWorkingSession(int orderId, int technicianId)
        {
            return await _dbContext.TechnicianWorkingSessions.AsNoTracking()
                .Select(x => new TechnicianWorkingSessionViewModel
                {
                    OrderId = x.OrderId,
                    Status = x.Status,
                    TechnicianId = x.TechnicianId,
                })
                .FirstOrDefaultAsync(x => x.OrderId == orderId && technicianId == x.TechnicianId);

        }

        public async Task MakeAvaliable(int id)
        {
            var technicianId = await _dbContext.TechnicianWorkingSessions
                .Where(x => x.OrderId == id)
                .Select(x => x.TechnicianId).ToListAsync();
            await _dbContext.Employees.Where(x => technicianId.Contains(x.Technician.Id)).ExecuteUpdateAsync(x=>x.SetProperty(s=>s.Status, Enums.EmployeeStatusEnum.Available));

        }

        public async Task MakeCancel(int id)
        {
            await _dbContext.TechnicianWorkingSessions.Where(x => x.OrderId == id).ExecuteUpdateAsync(
                x => x.SetProperty(s => s.EndTime, DateTime.Now)
                    .SetProperty(s => s.Status, Enums.TechnicianWorkingSessionEnum.Canceled)
                );
        }

        public async Task MakeProcessing(int id)
        {
            await _dbContext.TechnicianWorkingSessions.Where(x => x.OrderId == id).ExecuteUpdateAsync(
                x => x.SetProperty(s => s.Status, Enums.TechnicianWorkingSessionEnum.InProgress)
                );
        }

        public async Task UpdateStatusWorkingSession(int technician, TechnicianWorkingSessionUpdateModel model)
        {
            var data = await _dbContext.TechnicianWorkingSessions.Where(x=>x.TechnicianId == technician && x.OrderId == model.OrderId && x.EndTime == null).FirstOrDefaultAsync();
            if (data == null)
            {
                throw new Exception("Source not found");
            }
            data.Status = model.Status;
            if (model.Status == Enums.TechnicianWorkingSessionEnum.Completed) {

                var employee = await _dbContext.Employees.FirstOrDefaultAsync(x=>x.Technician.Id == technician);
                if(employee.Status==Enums.EmployeeStatusEnum.Busy) employee.Status = Enums.EmployeeStatusEnum.Available;
                data.EndTime = DateTime.Now;
                var technicianEntity = await _dbContext.Technicians.FirstOrDefaultAsync(x => x.Id == technician);
                technicianEntity.CompletedOrders += 1;
            }
            await _dbContext.SaveChangesAsync();


        }

        public async Task AddTechnician(TechnicianWorkingSession technicianWorkingSession) {
            await _dbContext.TechnicianWorkingSessions.AddAsync(technicianWorkingSession);

        }
    }
}
